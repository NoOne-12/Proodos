import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboard.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getDashboardStats);

export default router;
