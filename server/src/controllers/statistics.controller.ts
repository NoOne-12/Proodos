import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
import { subDays } from 'date-fns/subDays';
import { startOfWeek } from 'date-fns/startOfWeek';
import { startOfMonth } from 'date-fns/startOfMonth';
import { format } from 'date-fns/format';

export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const startOfToday = startOfDay(today);
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const startOfThisMonth = startOfMonth(today);

    // All sessions
    const allSessions = await prisma.learningSession.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: {
              include: { roadmap: true }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    const totalMinutes = allSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const todayMinutes = allSessions
      .filter(s => new Date(s.startedAt) >= startOfToday)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const weekMinutes = allSessions
      .filter(s => new Date(s.startedAt) >= startOfThisWeek)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const monthMinutes = allSessions
      .filter(s => new Date(s.startedAt) >= startOfThisMonth)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Skills stats
    const allSkills = await prisma.skill.findMany({
      where: {
        category: {
          roadmap: {
            userId
          }
        }
      }
    });

    const totalSkills = allSkills.length;
    const completedSkills = allSkills.filter(s => s.status === 'COMPLETED').length;
    const inProgressSkills = allSkills.filter(s => s.status === 'IN_PROGRESS').length;
    const notStartedSkills = allSkills.filter(s => s.status === 'NOT_STARTED').length;

    // Roadmaps stats
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      include: {
        categories: {
          include: { skills: true }
        }
      }
    });

    const roadmapSummaries = roadmaps.map(r => {
      let rTotal = 0;
      let rDone = 0;
      r.categories.forEach(c => {
        c.skills.forEach(s => {
          rTotal++;
          if (s.status === 'COMPLETED') rDone++;
        });
      });
      return {
        id: r.id,
        title: r.title,
        status: r.status,
        totalSkills: rTotal,
        completedSkills: rDone,
        progress: rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0
      };
    });

    // Category distribution (minutes learned per category)
    const categoryDistributionMap: Record<string, number> = {};
    allSessions.forEach(s => {
      const catName = s.skill?.category?.name || 'General';
      categoryDistributionMap[catName] = (categoryDistributionMap[catName] || 0) + s.durationMinutes;
    });

    const categoryDistribution = Object.keys(categoryDistributionMap).map(name => ({
      name,
      minutes: categoryDistributionMap[name],
      hours: +(categoryDistributionMap[name] / 60).toFixed(1)
    }));

    // Last 30 days activity
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(startOfToday, 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = allSessions.filter(s => format(new Date(s.startedAt), 'yyyy-MM-dd') === dateStr);
      return {
        date: dateStr,
        label: format(date, 'MMM dd'),
        minutes: daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
      };
    });

    // Day of week productivity (Mon-Sun)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const productivityByDay = dayNames.map(dayName => ({ day: dayName, minutes: 0 }));
    allSessions.forEach(s => {
      const dayIndex = new Date(s.startedAt).getDay();
      productivityByDay[dayIndex].minutes += s.durationMinutes;
    });

    // Streak calculation
    let currentStreak = 0;
    let longestStreak = 0;
    if (allSessions.length > 0) {
      const uniqueDays = Array.from(new Set(allSessions.map(s => format(new Date(s.startedAt), 'yyyy-MM-dd'))));
      let tempStreak = 1;
      longestStreak = 1;
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const d1 = new Date(uniqueDays[i]);
        const d2 = new Date(uniqueDays[i + 1]);
        const diffDays = Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) {
            const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
            const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
            if (isToday || isYesterday) currentStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      if (uniqueDays.length === 1) {
        longestStreak = 1;
        const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
        const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
        if (isToday || isYesterday) currentStreak = 1;
      } else if (tempStreak > 1 && currentStreak === 0) {
        const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
        const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
        if (isToday || isYesterday) currentStreak = tempStreak;
      }
    }

    res.json({
      success: true,
      data: {
        totalHours: +(totalMinutes / 60).toFixed(1),
        totalMinutes,
        todayMinutes,
        weekMinutes,
        monthMinutes,
        totalSkills,
        completedSkills,
        inProgressSkills,
        notStartedSkills,
        currentStreak,
        longestStreak,
        roadmapSummaries,
        categoryDistribution,
        last30Days,
        productivityByDay
      }
    });
  } catch (error) {
    next(error);
  }
};
