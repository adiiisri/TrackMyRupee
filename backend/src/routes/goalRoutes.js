import express from 'express';
import { getGoals, createGoal, addFunds, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.route('/:id/add-funds').put(protect, addFunds);
router.route('/:id').delete(protect, deleteGoal);

export default router;
