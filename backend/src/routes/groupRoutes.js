import express from 'express';
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  createGroupExpense,
  getGroupExpenses,
  updateGroupExpense,
  deleteGroupExpense,
  getGroupBalances
} from '../controllers/groupController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Define group creation and list route
router.route('/')
  .get(protect, getGroups)
  .post(protect, createGroup);

router.route('/:groupId')
  .put(protect, updateGroup)
  .delete(protect, deleteGroup);

// Define group expense posting and list route
router.route('/:groupId/expenses')
  .get(protect, getGroupExpenses)
  .post(protect, createGroupExpense);

// Define group expense edit and delete route
router.route('/:groupId/expenses/:expenseId')
  .put(protect, updateGroupExpense)
  .delete(protect, deleteGroupExpense);

// Define group balance and suggested transactions settlement route
router.route('/:groupId/balances')
  .get(protect, getGroupBalances);

export default router;

