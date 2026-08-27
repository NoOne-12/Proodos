import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { subDays } from 'date-fns/subDays';
import { format } from 'date-fns/format';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // Dynamically evaluate smart status reminders
    const [existingNotifs, todaysSessions, activeGoals, activeRoadmap] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.learningSession.findMany({
        where: {
          userId,
          startedAt: { gte: subDays(new Date(), 1) },
        },
      }),
      prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' },
      }),
      prisma.roadmap.findFirst({
        where: { userId, status: 'ACTIVE' },
        include: {
          categories: { include: { skills: true } },
        },
      }),
    ]);

    // Check if we should generate a new notification
    const todayMinutes = todaysSessions
      .filter((s) => format(new Date(s.startedAt), 'yyyy-MM-dd') === todayStr)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    const targetMinutes = activeRoadmap?.dailyTargetMinutes || 30;

    // 1. Check daily goal completed
    if (todayMinutes >= targetMinutes && todayMinutes > 0) {
      const alreadyNotified = existingNotifs.some(
        (n) => n.type === 'ACHIEVEMENT' && format(new Date(n.createdAt), 'yyyy-MM-dd') === todayStr
      );
      if (!alreadyNotified) {
        await prisma.notification.create({
          data: {
            userId,
            title: '🎯 Daily Target Reached!',
            message: `Awesome work! You completed ${todayMinutes} focus minutes today, surpassing your ${targetMinutes}m target.`,
            type: 'ACHIEVEMENT',
            linkUrl: '/statistics',
          },
        });
      }
    }

    // 2. Check roadmap milestone
    if (activeRoadmap) {
      let totalSkills = 0;
      let completedSkills = 0;
      activeRoadmap.categories.forEach((c) => {
        c.skills.forEach((s) => {
          totalSkills++;
          if (s.status === 'COMPLETED') completedSkills++;
        });
      });

      if (totalSkills > 0 && completedSkills === totalSkills) {
        const alreadyNotified = existingNotifs.some(
          (n) => n.type === 'ACHIEVEMENT' && n.title.includes(activeRoadmap.title)
        );
        if (!alreadyNotified) {
          await prisma.notification.create({
            data: {
              userId,
              title: `🎉 Completed ${activeRoadmap.title}!`,
              message: `Congratulations! You have mastered all ${totalSkills} skills in your ${activeRoadmap.title} roadmap.`,
              type: 'ACHIEVEMENT',
              linkUrl: `/roadmaps/${activeRoadmap.id}`,
            },
          });
        }
      }
    }

    // Fetch fresh list after smart evaluation
    const notifs = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifs.filter((n) => !n.read).length;

    res.json({
      success: true,
      data: notifs,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
