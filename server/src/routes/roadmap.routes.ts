import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getRoadmaps, getRoadmap, createRoadmap, updateRoadmap, deleteRoadmap } from '../controllers/roadmap.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getRoadmaps);
router.get('/:id', getRoadmap);
router.post('/', createRoadmap);
router.put('/:id', updateRoadmap);
router.delete('/:id', deleteRoadmap);

export default router;
