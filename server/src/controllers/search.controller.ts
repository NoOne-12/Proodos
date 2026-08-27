import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const query = String(req.query.q || '').trim();

    if (!query) {
      return res.json({
        success: true,
        data: {
          roadmaps: [],
          categories: [],
          skills: [],
          goals: [],
          learningSessions: [],
        },
      });
    }

    const [roadmaps, skills, goals, sessions] = await Promise.all([
      // Search user's Roadmaps
      prisma.roadmap.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          dailyTargetMinutes: true,
        },
        take: 8,
      }),

      // Search user's Skills
      prisma.skill.findMany({
        where: {
          category: {
            roadmap: {
              userId,
            },
          },
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { notes: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              roadmapId: true,
              roadmap: {
                select: { id: true, title: true },
              },
            },
          },
        },
        take: 12,
      }),

      // Search user's Goals
      prisma.goal.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          targetValue: true,
          currentValue: true,
          status: true,
        },
        take: 6,
      }),

      // Search user's Session notes
      prisma.learningSession.findMany({
        where: {
          userId,
          notes: { contains: query, mode: 'insensitive' },
        },
        include: {
          skill: {
            select: { id: true, title: true },
          },
        },
        take: 6,
      }),
    ]);

    res.json({
      success: true,
      data: {
        roadmaps,
        skills,
        goals,
        learningSessions: sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};
