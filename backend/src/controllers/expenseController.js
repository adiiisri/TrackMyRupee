import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = asyncHandler(async (req, res) => {
  const { category, month, year, search } = req.query;

  let query = { user: req.user._id };

  if (category && category !== 'All') {
    query.category = category;
  }

  // Basic handling for month/year filtering
  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    query.date = { $gte: startDate, $lt: endDate };
  }

  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json(expenses);
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, description, isRecurring, recurringFrequency } = req.body;

  const expense = new Expense({
    user: req.user._id,
    amount,
    category,
    date: date || Date.now(),
    description,
    isRecurring: isRecurring || false,
    recurringFrequency: recurringFrequency || 'none',
    lastGeneratedDate: isRecurring ? Date.now() : null
  });

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, description, isRecurring, recurringFrequency } = req.body;

  const expense = await Expense.findById(req.params.id);

  if (expense && expense.user.toString() === req.user._id.toString()) {
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;
    expense.isRecurring = isRecurring !== undefined ? isRecurring : expense.isRecurring;
    expense.recurringFrequency = recurringFrequency || expense.recurringFrequency;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } else {
    res.status(404);
    throw new Error('Expense not found or unauthorized');
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (expense && expense.user.toString() === req.user._id.toString()) {
    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense removed' });
  } else {
    res.status(404);
    throw new Error('Expense not found or unauthorized');
  }
});
