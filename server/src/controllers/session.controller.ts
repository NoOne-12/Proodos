import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const sessionSchema = z.object({
  skillId: z.string().uuid(),
  startedAt: z.string().transform(str => new Date(str)),
  endedAt: z.string().optional().nullable().transform(str => str ? new Date(str) : new Date()),
  durationMinutes: z.number().int().min(1),
  notes: z.string().optional().nullable()
});

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = sessionSchema.parse(req.body);
    
    const skill = await prisma.skill.findUnique({ 
      where: { id: data.skillId },
      include: { category: { include: { roadmap: true } } }
    });
    
    if (!skill || skill.category.roadmap.userId !== userId) {
      throw new AppError('Skill not found', 404);
    }

    // Auto mark skill as IN_PROGRESS if it was NOT_STARTED
    if (skill.status === 'NOT_STARTED') {
      await prisma.skill.update({
        where: { id: skill.id },
        data: { status: 'IN_PROGRESS' }
      });
    }
    
    const session = await prisma.learningSession.create({
      data: {
        userId,
        skillId: data.skillId,
        startedAt: data.startedAt,
        endedAt: data.endedAt,
        durationMinutes: data.durationMinutes,
        notes: data.notes
      }
    });

    // Update any relevant goals (DURATION type)
    const durationGoals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        type: 'DURATION'
      }
    });

    for (const goal of durationGoals) {
      if (!goal.roadmapId || goal.roadmapId === skill.category.roadmapId) {
        const newTotal = goal.currentValue + data.durationMinutes;
        await prisma.goal.update({
          where: { id: goal.id },
          data: {
            currentValue: newTotal,
            status: newTotal >= goal.targetValue ? 'COMPLETED' : 'ACTIVE'
          }
        });
      }
    }
    
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { roadmapId, categoryId, skillId, limit } = req.query;

    const where: any = { userId };
    if (skillId) {
      where.skillId = String(skillId);
    } else if (categoryId) {
      where.skill = { categoryId: String(categoryId) };
    } else if (roadmapId) {
      where.skill = { category: { roadmapId: String(roadmapId) } };
    }

    const sessions = await prisma.learningSession.findMany({
      where,
      include: {
        skill: {
          include: {
            category: {
              include: {
                roadmap: true
              }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: limit ? parseInt(String(limit), 10) : 100
    });
    
    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};
