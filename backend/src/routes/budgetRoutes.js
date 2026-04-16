import express from 'express';
import { getBudgets, setBudget } from '../controllers/budgetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBudgets)
  .post(protect, setBudget);

export default router;
