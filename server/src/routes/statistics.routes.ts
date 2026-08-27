import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getStatistics } from '../controllers/statistics.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getStatistics);

export default router;
