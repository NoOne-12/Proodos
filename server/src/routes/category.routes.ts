import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
