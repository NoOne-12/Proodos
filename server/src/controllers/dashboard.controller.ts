import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Get today's sessions
    const todaysSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    });

    const todaysLearningTime = todaysSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Get active roadmap
    const activeRoadmap = await prisma.roadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        categories: {
          include: {
            skills: true
          }
        }
      }
    });

    let overallProgress = 0;
    let completedSkillsCount = 0;
    let inProgressSkillsCount = 0;
    let remainingSkillsCount = 0;
    
    if (activeRoadmap) {
      let totalSkills = 0;
      activeRoadmap.categories.forEach(category => {
        category.skills.forEach(skill => {
          totalSkills++;
          if (skill.status === 'COMPLETED') completedSkillsCount++;
          else if (skill.status === 'IN_PROGRESS') inProgressSkillsCount++;
          else remainingSkillsCount++;
        });
      });
      
      if (totalSkills > 0) {
        overallProgress = Math.round((completedSkillsCount / totalSkills) * 100);
      }
    }

    // Weekly consistency (last 7 days)
    const sevenDaysAgo = subDays(startOfToday, 6);
    const recentSessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: { gte: sevenDaysAgo }
      }
    });

    const weeklyChart = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(startOfToday, 6 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      const daySessions = recentSessions.filter(s => 
        format(new Date(s.startedAt), 'yyyy-MM-dd') === dateString
      );
      
      return {
        date: dateString,
        dayName: format(date, 'EEE'),
        minutes: daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
      };
    });

    // Calculate Streak (naive calculation for now)
    // A robust streak calculation would iterate over all past days, 
    // but for the sake of simplicity, we'll just check consecutive days backwards from today/yesterday.
    let currentStreak = 0;
    let longestStreak = 0; // Requires full history query, hardcoded for this snippet unless we query all
    
    const allSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      select: { startedAt: true }
    });
    
    if (allSessions.length > 0) {
      const uniqueDays = Array.from(new Set(allSessions.map(s => format(new Date(s.startedAt), 'yyyy-MM-dd'))));
      
      // Calculate longest and current
      let tempStreak = 1;
      longestStreak = 1;
      
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const d1 = new Date(uniqueDays[i]);
        const d2 = new Date(uniqueDays[i + 1]);
        const diffTime = Math.abs(d1.getTime() - d2.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) {
            // Check if yesterday or today is uniqueDays[0]
            const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
            const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
            if (isToday || isYesterday) {
              currentStreak = tempStreak;
            } else {
              currentStreak = 0;
            }
          }
          tempStreak = 1;
        }
      }
      
      if (uniqueDays.length === 1) {
        longestStreak = 1;
        const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
        const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
        if (isToday || isYesterday) {
          currentStreak = 1;
        }
      } else if (tempStreak > 1 && currentStreak === 0) {
        // if ended on last iteration
         const isToday = uniqueDays[0] === format(today, 'yyyy-MM-dd');
         const isYesterday = uniqueDays[0] === format(subDays(today, 1), 'yyyy-MM-dd');
         if (isToday || isYesterday) {
           currentStreak = tempStreak;
         }
      }
    }

    res.json({
      success: true,
      data: {
        todaysLearningTime,
        todaysTarget: activeRoadmap?.dailyTargetMinutes || 30,
        currentStreak,
        longestStreak,
        overallProgress,
        completedSkillsCount,
        inProgressSkillsCount,
        remainingSkillsCount,
        weeklyChart,
        recentActivity: recentSessions.slice(0, 5) // Last 5 sessions
      }
    });
  } catch (error) {
    next(error);
  }
};
