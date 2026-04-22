import asyncHandler from 'express-async-handler';
import Income from '../models/Income.js';

// @desc    Get all incomes for logged in user
// @route   GET /api/incomes
// @access  Private
export const getIncomes = asyncHandler(async (req, res) => {
  const { source, month, year, search } = req.query;

  let query = { user: req.user._id };

  if (source && source !== 'All') {
    query.source = source;
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

  const incomes = await Income.find(query).sort({ date: -1 });
  res.json(incomes);
});

// @desc    Create new income
// @route   POST /api/incomes
// @access  Private
export const createIncome = asyncHandler(async (req, res) => {
  const { amount, source, date, description, isRecurring, recurringFrequency } = req.body;

  const income = new Income({
    user: req.user._id,
    amount,
    source,
    date: date || Date.now(),
    description,
    isRecurring: isRecurring || false,
    recurringFrequency: recurringFrequency || 'none',
    lastGeneratedDate: isRecurring ? Date.now() : null
  });

  const createdIncome = await income.save();
  res.status(201).json(createdIncome);
});

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
export const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (income && income.user.toString() === req.user._id.toString()) {
    await Income.deleteOne({ _id: req.params.id });
    res.json({ message: 'Income removed' });
  } else {
    res.status(404);
    throw new Error('Income not found or unauthorized');
  }
});
