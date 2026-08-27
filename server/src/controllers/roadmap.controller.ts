import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const roadmapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  dailyTargetMinutes: z.number().min(1).default(30)
});

export const getRoadmaps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      include: {
        categories: {
          include: {
            skills: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: roadmaps });
  } catch (error) {
    next(error);
  }
};

export const getRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    
    const roadmap = await prisma.roadmap.findFirst({
      where: { id, userId },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!roadmap) {
      throw new AppError('Roadmap not found', 404);
    }

    res.json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

export const createRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = roadmapSchema.parse(req.body);
    
    const roadmap = await prisma.roadmap.create({
      data: {
        ...data,
        userId
      }
    });
    
    res.status(201).json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

export const updateRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    const data = roadmapSchema.partial().parse(req.body);
    
    const existing = await prisma.roadmap.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Roadmap not found', 404);
    
    const roadmap = await prisma.roadmap.update({
      where: { id },
      data
    });
    
    res.json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

export const deleteRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    
    const existing = await prisma.roadmap.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Roadmap not found', 404);
    
    await prisma.roadmap.delete({ where: { id } });
    
    res.json({ success: true, message: 'Roadmap deleted successfully' });
  } catch (error) {
    next(error);
  }
};
