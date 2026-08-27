import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const goalSchema = z.object({
  roadmapId: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  type: z.enum(['DEADLINE', 'DURATION', 'COUNT']),
  targetValue: z.number().min(1, 'Target value must be at least 1'),
  currentValue: z.number().min(0).default(0),
  deadline: z.string().optional().nullable().transform(str => str ? new Date(str) : undefined),
  status: z.enum(['ACTIVE', 'COMPLETED', 'FAILED']).default('ACTIVE')
});

export const getGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        roadmap: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = goalSchema.parse(req.body);
    
    if (data.roadmapId) {
      const roadmap = await prisma.roadmap.findFirst({ where: { id: data.roadmapId, userId } });
      if (!roadmap) throw new AppError('Roadmap not found', 404);
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        type: data.type,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        deadline: data.deadline,
        status: data.status,
        roadmapId: data.roadmapId || null
      }
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    const data = goalSchema.partial().parse(req.body);

    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Goal not found', 404);

    let status = data.status || existing.status;
    if (data.currentValue !== undefined && data.currentValue >= (data.targetValue || existing.targetValue)) {
      status = 'COMPLETED';
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        ...data,
        status,
        deadline: data.deadline !== undefined ? data.deadline : existing.deadline
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);

    const existing = await prisma.goal.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Goal not found', 404);

    await prisma.goal.delete({ where: { id } });

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
