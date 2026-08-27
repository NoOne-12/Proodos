import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createSkill, updateSkill, deleteSkill, updateSkillStatus } from '../controllers/skill.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createSkill);
router.put('/:id', updateSkill);
router.patch('/:id/status', updateSkillStatus);
router.delete('/:id', deleteSkill);

export default router;
