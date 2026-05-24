import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
export const createGroup = asyncHandler(async (req, res) => {
  const { name, members } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Group name is required');
  }

  // Creator is automatically added as a member
  const memberIds = new Set();
  memberIds.add(req.user._id.toString());

  if (Array.isArray(members)) {
    for (const member of members) {
      if (typeof member === 'string') {
        const trimmed = member.trim();
        if (trimmed.includes('@')) {
          let user = await User.findOne({ email: trimmed.toLowerCase() });
          if (!user) {
            // Auto-create a placeholder user for missing emails to ease adoption
            user = await User.create({
              name: trimmed.split('@')[0],
              email: trimmed.toLowerCase(),
              password: Math.random().toString(36).substring(2, 10),
            });
          }
          memberIds.add(user._id.toString());
        } else if (mongoose.Types.ObjectId.isValid(trimmed)) {
          memberIds.add(trimmed);
        }
      }
    }
  }

  const group = new Group({
    name,
    creator: req.user._id,
    members: Array.from(memberIds),
  });

  const createdGroup = await group.save();
  
  // Populate members info before returning
  const populatedGroup = await Group.findById(createdGroup._id).populate('members', 'name email');
  res.status(201).json(populatedGroup);
});

// @desc    Log a new group expense
// @route   POST /api/groups/:groupId/expenses
// @access  Private
export const createGroupExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, paidBy, date, splits } = req.body;
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Verify requester is a member of the group
  const isMember = group.members.some(id => id.toString() === req.user._id.toString());
  if (!isMember) {
    res.status(403);
    throw new Error('Unauthorized: You are not a member of this group');
  }

  // Default payer to logged-in user if not specified
  const payerId = paidBy || req.user._id;

  // Verify payer is a group member
  const isPayerMember = group.members.some(id => id.toString() === payerId.toString());
  if (!isPayerMember) {
    res.status(400);
    throw new Error('PaidBy user must be a member of the group');
  }

  let finalSplits = [];

  if (splits && Array.isArray(splits) && splits.length > 0) {
    // Unequal Splitting
    let sum = 0;
    for (const s of splits) {
      const isSplitUserMember = group.members.some(id => id.toString() === s.user.toString());
      if (!isSplitUserMember) {
        res.status(400);
        throw new Error(`User ${s.user} in splits is not a member of this group`);
      }
      sum += Number(s.amount);
      finalSplits.push({
        user: s.user,
        amount: Number(s.amount)
      });
    }

    // Verify sum equals amount (handling potential floating point issues)
    if (Math.abs(sum - amount) > 0.01) {
      res.status(400);
      throw new Error(`The sum of split amounts (${sum}) must equal the total expense amount (${amount})`);
    }
  } else {
    // Equal Splitting with rounding cents adjustment
    const numMembers = group.members.length;
    const baseSplit = Math.floor((amount / numMembers) * 100) / 100;
    let totalAllocated = baseSplit * numMembers;
    let difference = Number((amount - totalAllocated).toFixed(2));

    finalSplits = group.members.map((memberId, idx) => {
      let memberSplit = baseSplit;
      if (idx < Math.round(difference * 100)) {
        memberSplit = Number((memberSplit + 0.01).toFixed(2));
      }
      return {
        user: memberId,
        amount: memberSplit
      };
    });
  }

  const expense = new Expense({
    user: req.user._id,
    group: groupId,
    paidBy: payerId,
    amount,
    category: category || 'Other',
    description: description || 'Group Expense',
    date: date || Date.now(),
    splits: finalSplits,
  });

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
});

// @desc    Get breakdown of balances and settlements in a group
// @route   GET /api/groups/:groupId/balances
// @access  Private
export const getGroupBalances = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId).populate('members', 'name email');
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Verify requester is a member of the group
  const isMember = group.members.some(m => m._id.toString() === req.user._id.toString());
  if (!isMember) {
    res.status(403);
    throw new Error('Unauthorized: You are not a member of this group');
  }

  // Get all expenses logged in this group
  const expenses = await Expense.find({ group: groupId });

  const balances = {};
  group.members.forEach(m => {
    balances[m._id.toString()] = 0;
  });

  for (const exp of expenses) {
    const payerIdStr = exp.paidBy.toString();
    if (balances[payerIdStr] !== undefined) {
      balances[payerIdStr] += exp.amount;
    }

    for (const split of exp.splits) {
      const splitUserStr = split.user.toString();
      if (balances[splitUserStr] !== undefined) {
        balances[splitUserStr] -= split.amount;
      }
    }
  }

  // Match debtors & creditors
  const creditors = [];
  const debtors = [];

  for (const m of group.members) {
    const memberIdStr = m._id.toString();
    const net = Number(balances[memberIdStr].toFixed(2));
    if (net > 0.01) {
      creditors.push({ user: m, balance: net });
    } else if (net < -0.01) {
      debtors.push({ user: m, balance: -net });
    }
  }

  // Sort descending
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  const transactions = [];
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const amountToSettle = Number(Math.min(creditor.balance, debtor.balance).toFixed(2));

    if (amountToSettle > 0.01) {
      transactions.push({
        from: { _id: debtor.user._id, name: debtor.user.name, email: debtor.user.email },
        to: { _id: creditor.user._id, name: creditor.user.name, email: creditor.user.email },
        amount: amountToSettle
      });
    }

    creditor.balance = Number((creditor.balance - amountToSettle).toFixed(2));
    debtor.balance = Number((debtor.balance - amountToSettle).toFixed(2));

    if (creditor.balance <= 0.01) cIdx++;
    if (debtor.balance <= 0.01) dIdx++;
  }

  res.status(200).json({
    group: {
      _id: group._id,
      name: group.name,
    },
    balances: Object.keys(balances).map(id => {
      const user = group.members.find(m => m._id.toString() === id);
      return {
        user: { _id: user._id, name: user.name, email: user.email },
        netBalance: Number(balances[id].toFixed(2))
      };
    }),
    suggestedSettlements: transactions
  });
});

// @desc    Get all groups for logged-in user
// @route   GET /api/groups
// @access  Private
export const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .populate('members', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(groups);
});

// @desc    Update a group (name and members list)
// @route   PUT /api/groups/:groupId
// @access  Private
export const updateGroup = asyncHandler(async (req, res) => {
  const { name, members } = req.body;
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Any member of the group can edit group details/members
  const isMember = group.members.some(id => id.toString() === req.user._id.toString());
  if (!isMember) {
    res.status(403);
    throw new Error('Unauthorized: You are not a member of this group');
  }


  if (name) {
    group.name = name.trim();
  }

  if (Array.isArray(members)) {
    // Creator must be part of the group
    const memberIds = new Set();
    memberIds.add(group.creator.toString());

    for (const member of members) {
      if (typeof member === 'string') {
        const trimmed = member.trim();
        if (trimmed.includes('@')) {
          let user = await User.findOne({ email: trimmed.toLowerCase() });
          if (!user) {
            // Auto-create a placeholder user for missing emails to ease adoption
            user = await User.create({
              name: trimmed.split('@')[0],
              email: trimmed.toLowerCase(),
              password: Math.random().toString(36).substring(2, 10),
            });
          }
          memberIds.add(user._id.toString());
        } else if (mongoose.Types.ObjectId.isValid(trimmed)) {
          memberIds.add(trimmed);
        }
      } else if (member && member._id) {
        memberIds.add(member._id.toString());
      }
    }

    group.members = Array.from(memberIds);
  }

  const updatedGroup = await group.save();
  const populatedGroup = await Group.findById(updatedGroup._id).populate('members', 'name email');
  res.status(200).json(populatedGroup);
});

// @desc    Get all expenses logged in a group
// @route   GET /api/groups/:groupId/expenses
// @access  Private
export const getGroupExpenses = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const isMember = group.members.some(id => id.toString() === req.user._id.toString());
  if (!isMember) {
    res.status(403);
    throw new Error('Unauthorized: You are not a member of this group');
  }

  const expenses = await Expense.find({ group: groupId })
    .sort({ date: -1 })
    .populate('paidBy', 'name email')
    .populate('splits.user', 'name email');

  res.status(200).json(expenses);
});

// @desc    Update a group expense amount or splits
// @route   PUT /api/groups/:groupId/expenses/:expenseId
// @access  Private
export const updateGroupExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, paidBy, date, splits } = req.body;
  const { groupId, expenseId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  // Verify permissions: Only payer or logger can edit
  const isAuthorized = expense.user.toString() === req.user._id.toString() || expense.paidBy.toString() === req.user._id.toString();
  if (!isAuthorized) {
    res.status(403);
    throw new Error('Unauthorized to edit this expense');
  }

  // If amount, splits or paidBy are updated, validate they exist in group
  const payerId = paidBy || expense.paidBy;
  const isPayerMember = group.members.some(id => id.toString() === payerId.toString());
  if (!isPayerMember) {
    res.status(400);
    throw new Error('PaidBy user must be a member of the group');
  }

  expense.paidBy = payerId;
  expense.amount = amount !== undefined ? Number(amount) : expense.amount;
  expense.category = category || expense.category;
  expense.description = description !== undefined ? description.trim() : expense.description;
  expense.date = date || expense.date;

  if (splits && Array.isArray(splits) && splits.length > 0) {
    // Unequal splits validation
    let sum = 0;
    const finalSplits = [];
    for (const s of splits) {
      const isSplitUserMember = group.members.some(id => id.toString() === s.user.toString());
      if (!isSplitUserMember) {
        res.status(400);
        throw new Error(`User ${s.user} in splits is not a member of this group`);
      }
      sum += Number(s.amount);
      finalSplits.push({
        user: s.user,
        amount: Number(s.amount)
      });
    }

    if (Math.abs(sum - expense.amount) > 0.01) {
      res.status(400);
      throw new Error(`The sum of split amounts (${sum}) must equal the total expense amount (${expense.amount})`);
    }

    expense.splits = finalSplits;
  } else if (amount !== undefined || splits) {
    // Recalculate equal splits for updated amount
    const numMembers = group.members.length;
    const baseSplit = Math.floor((expense.amount / numMembers) * 100) / 100;
    let totalAllocated = baseSplit * numMembers;
    let difference = Number((expense.amount - totalAllocated).toFixed(2));

    expense.splits = group.members.map((memberId, idx) => {
      let memberSplit = baseSplit;
      if (idx < Math.round(difference * 100)) {
        memberSplit = Number((memberSplit + 0.01).toFixed(2));
      }
      return {
        user: memberId,
        amount: memberSplit
      };
    });
  }

  const updatedExpense = await expense.save();
  res.status(200).json(updatedExpense);
});

// @desc    Delete a group expense
// @route   DELETE /api/groups/:groupId/expenses/:expenseId
// @access  Private
export const deleteGroupExpense = asyncHandler(async (req, res) => {
  const { groupId, expenseId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  // Only payer or logger can delete
  const isAuthorized = expense.user.toString() === req.user._id.toString() || expense.paidBy.toString() === req.user._id.toString();
  if (!isAuthorized) {
    res.status(403);
    throw new Error('Unauthorized to delete this expense');
  }

  await Expense.deleteOne({ _id: expenseId });
  res.status(200).json({ message: 'Group expense removed' });
});

