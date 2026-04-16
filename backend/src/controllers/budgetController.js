import asyncHandler from 'express-async-handler';
import Budget from '../models/Budget.js';

// @desc    Get user budgets for a specific month and year
// @route   GET /api/budgets
// @access  Private
export const getBudgets = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = { user: req.user._id };
  if (month && year) {
    query.month = month;
    query.year = year;
  }

  const budgets = await Budget.find(query);
  res.json(budgets);
});

// @desc    Set or update a budget for a category
// @route   POST /api/budgets
// @access  Private
export const setBudget = asyncHandler(async (req, res) => {
  const { category, amount, month, year } = req.body;

  let budget = await Budget.findOne({
    user: req.user._id,
    category,
    month,
    year,
  });

  if (budget) {
    // Update existing budget
    budget.amount = amount;
    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } else {
    // Create new budget
    budget = new Budget({
      user: req.user._id,
      category,
      amount,
      month,
      year,
    });
    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  }
});
