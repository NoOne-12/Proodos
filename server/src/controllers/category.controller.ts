import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const categorySchema = z.object({
  roadmapId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  order: z.number().int().default(0)
});

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const data = categorySchema.parse(req.body);
    
    const roadmap = await prisma.roadmap.findFirst({ where: { id: data.roadmapId, userId } });
    if (!roadmap) throw new AppError('Roadmap not found', 404);
    
    const category = await prisma.category.create({
      data
    });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    const data = categorySchema.partial().omit({ roadmapId: true }).parse(req.body);
    
    const category = await prisma.category.findUnique({ where: { id }, include: { roadmap: true } });
    if (!category || (category as any).roadmap.userId !== userId) {
      throw new AppError('Category not found', 404);
    }
    
    const updated = await prisma.category.update({
      where: { id },
      data
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const id = String(req.params.id);
    
    const category = await prisma.category.findUnique({ where: { id }, include: { roadmap: true } });
    if (!category || (category as any).roadmap.userId !== userId) {
      throw new AppError('Category not found', 404);
    }
    
    await prisma.category.delete({ where: { id } });
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
