import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { AppError } from '../utils/errors';
import { SkillStatus } from '@prisma/client';

const skillSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
  estimatedMinutes: z.number().int().optional().nullable(),
  resourceUrl: z.string().url('Invalid URL format').optional().nullable().or(z.literal(''))
});

const skillStatusSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
});

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = skillSchema.parse(req.body);
    
    const category = await prisma.category.findUnique({ 
      where: { id: data.categoryId },
      include: { roadmap: true }
    });
    
    if (!category || (category as any).roadmap.userId !== userId) {
      throw new AppError('Category not found', 404);
    }
    
    const skill = await prisma.skill.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
        resourceUrl: data.resourceUrl ? data.resourceUrl : null
      }
    });
    
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    const data = skillSchema.partial().omit({ categoryId: true }).parse(req.body);
    
    const skill = await prisma.skill.findUnique({ 
      where: { id },
      include: { category: { include: { roadmap: true } } }
    });
    
    if (!skill || (skill as any).category.roadmap.userId !== userId) {
      throw new AppError('Skill not found', 404);
    }
    
    const updateData = { ...data };
    if (data.resourceUrl !== undefined) {
      updateData.resourceUrl = data.resourceUrl ? data.resourceUrl : null;
    }
    
    const updated = await prisma.skill.update({
      where: { id },
      data: updateData
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const updateSkillStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    const { status } = skillStatusSchema.parse(req.body);
    
    const skill = await prisma.skill.findUnique({ 
      where: { id },
      include: { category: { include: { roadmap: true } } }
    });
    
    if (!skill || (skill as any).category.roadmap.userId !== userId) {
      throw new AppError('Skill not found', 404);
    }

    const wasCompleted = skill.status === 'COMPLETED';
    const isCompleted = status === 'COMPLETED';
    
    const updated = await prisma.skill.update({
      where: { id },
      data: {
        status: status as SkillStatus,
        completedAt: isCompleted ? new Date() : null
      }
    });

    // Update COUNT goals for skill completions
    if (!wasCompleted && isCompleted) {
      const countGoals = await prisma.goal.findMany({
        where: { userId, status: 'ACTIVE', type: 'COUNT' }
      });
      for (const goal of countGoals) {
        if (!goal.roadmapId || goal.roadmapId === skill.category.roadmapId) {
          const newCurrent = goal.currentValue + 1;
          await prisma.goal.update({
            where: { id: goal.id },
            data: {
              currentValue: newCurrent,
              status: newCurrent >= goal.targetValue ? 'COMPLETED' : 'ACTIVE'
            }
          });
        }
      }
    }
    
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    
    const skill = await prisma.skill.findUnique({ 
      where: { id },
      include: { category: { include: { roadmap: true } } }
    });
    
    if (!skill || (skill as any).category.roadmap.userId !== userId) {
      throw new AppError('Skill not found', 404);
    }
    
    await prisma.skill.delete({ where: { id } });
    
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};
