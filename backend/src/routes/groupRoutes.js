import express from 'express';
import { createGroup, createGroupExpense, getGroupBalances } from '../controllers/groupController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Define group creation route
router.route('/')
  .post(protect, createGroup);

// Define group expense posting route
router.route('/:groupId/expenses')
  .post(protect, createGroupExpense);

// Define group balance and suggested transactions settlement route
router.route('/:groupId/balances')
  .get(protect, getGroupBalances);

export default router;
