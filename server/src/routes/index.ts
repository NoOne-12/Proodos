import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import roadmapRoutes from './roadmap.routes';
import categoryRoutes from './category.routes';
import skillRoutes from './skill.routes';
import sessionRoutes from './session.routes';
import dashboardRoutes from './dashboard.routes';
import goalRoutes from './goal.routes';
import statisticsRoutes from './statistics.routes';
import searchRoutes from './search.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/categories', categoryRoutes);
router.use('/skills', skillRoutes);
router.use('/learning/sessions', sessionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/goals', goalRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);

router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
