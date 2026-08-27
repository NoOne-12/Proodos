import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
import { subDays } from 'date-fns/subDays';
import { startOfWeek } from 'date-fns/startOfWeek';
import { endOfWeek } from 'date-fns/endOfWeek';
import { format } from 'date-fns/format';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

    // 1. Get today's sessions & total time
    const todaysSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });
    const todaysLearningTime = todaysSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // 2. Get active roadmap with categories and skills
    const activeRoadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            skills: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    let overallProgress = 0;
    let completedSkillsCount = 0;
    let inProgressSkillsCount = 0;
    let remainingSkillsCount = 0;
    let recommendedSkill: any = null;

    if (activeRoadmap) {
      let totalSkills = 0;
      let firstInProgressSkill: any = null;
      let firstNotStartedSkill: any = null;

      activeRoadmap.categories.forEach((category) => {
        category.skills.forEach((skill) => {
          totalSkills++;
          if (skill.status === 'COMPLETED') {
            completedSkillsCount++;
          } else if (skill.status === 'IN_PROGRESS') {
            inProgressSkillsCount++;
            if (!firstInProgressSkill) {
              firstInProgressSkill = {
                ...skill,
                categoryName: category.name,
                roadmapTitle: activeRoadmap.title,
                roadmapId: activeRoadmap.id,
              };
            }
          } else {
            remainingSkillsCount++;
            if (!firstNotStartedSkill) {
              firstNotStartedSkill = {
                ...skill,
                categoryName: category.name,
                roadmapTitle: activeRoadmap.title,
                roadmapId: activeRoadmap.id,
              };
            }
          }
        });
      });

      if (totalSkills > 0) {
        overallProgress = Math.round((completedSkillsCount / totalSkills) * 100);
      }

      // Feature 10: "What should I learn today?" deterministic recommendation
      recommendedSkill = firstInProgressSkill || firstNotStartedSkill || null;
    }

    // 3. Weekly consistency (last 7 days)
    const sevenDaysAgo = subDays(startOfToday, 6);
    const recentSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: { gte: sevenDaysAgo },
      },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    const weeklyChart = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(startOfToday, 6 - i);
      const dateString = format(date, 'yyyy-MM-dd');

      const daySessions = recentSessions.filter(
        (s) => format(new Date(s.startedAt), 'yyyy-MM-dd') === dateString
      );

      return {
        date: dateString,
        dayName: format(date, 'EEE'),
        minutes: daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0),
      };
    });

    // 4. Activity Calendar heatmap (last 12 weeks / 84 days)
    const eightyFourDaysAgo = subDays(startOfToday, 83);
    const calendarSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: { gte: eightyFourDaysAgo },
      },
      select: {
        startedAt: true,
        durationMinutes: true,
      },
    });

    const activityCalendarMap: Record<string, { minutes: number; count: number }> = {};
    calendarSessions.forEach((s) => {
      const dayStr = format(new Date(s.startedAt), 'yyyy-MM-dd');
      if (!activityCalendarMap[dayStr]) {
        activityCalendarMap[dayStr] = { minutes: 0, count: 0 };
      }
      activityCalendarMap[dayStr].minutes += s.durationMinutes;
      activityCalendarMap[dayStr].count += 1;
    });

    const activityCalendar = Array.from({ length: 84 }).map((_, i) => {
      const date = subDays(startOfToday, 83 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const data = activityCalendarMap[dateStr] || { minutes: 0, count: 0 };
      return {
        date: dateStr,
        dayName: format(date, 'EEE'),
        monthName: format(date, 'MMM'),
        minutes: data.minutes,
        count: data.count,
        level: data.minutes === 0 ? 0 : data.minutes < 30 ? 1 : data.minutes < 60 ? 2 : 3,
      };
    });

    // 5. Accurate Streak Calculation (Iterate consecutive active calendar days)
    let currentStreak = 0;
    let longestStreak = 0;

    const allSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      select: { startedAt: true },
    });

    if (allSessions.length > 0) {
      const uniqueDays = Array.from(
        new Set(allSessions.map((s) => format(new Date(s.startedAt), 'yyyy-MM-dd')))
      ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending

      const todayStr = format(today, 'yyyy-MM-dd');
      const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

      // Check if streak is currently active (learned today or yesterday)
      if (uniqueDays[0] === todayStr || uniqueDays[0] === yesterdayStr) {
        let expectedDate = new Date(uniqueDays[0]);
        currentStreak = 1;

        for (let i = 1; i < uniqueDays.length; i++) {
          const prevDateExpected = format(subDays(expectedDate, 1), 'yyyy-MM-dd');
          if (uniqueDays[i] === prevDateExpected) {
            currentStreak++;
            expectedDate = new Date(uniqueDays[i]);
          } else {
            break;
          }
        }
      }

      // Calculate longest historical streak
      let maxStreak = 1;
      let curRunning = 1;
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const dCurrent = new Date(uniqueDays[i]);
        const dNext = new Date(uniqueDays[i + 1]);
        const diffDays = Math.round(
          Math.abs(dCurrent.getTime() - dNext.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          curRunning++;
          maxStreak = Math.max(maxStreak, curRunning);
        } else {
          curRunning = 1;
        }
      }
      longestStreak = Math.max(maxStreak, currentStreak);
    }

    // 6. Weekly learning stats & progress
    const thisWeekSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfThisWeek,
          lte: endOfThisWeek,
        },
      },
    });
    const weeklyLearningMinutes = thisWeekSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    res.json({
      success: true,
      data: {
        todaysLearningTime,
        todaysTarget: activeRoadmap?.dailyTargetMinutes || 30,
        weeklyLearningMinutes,
        currentStreak,
        longestStreak,
        overallProgress,
        completedSkillsCount,
        inProgressSkillsCount,
        remainingSkillsCount,
        recommendedSkill,
        weeklyChart,
        activityCalendar,
        recentActivity: recentSessions.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
