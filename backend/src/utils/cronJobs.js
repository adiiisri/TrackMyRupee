import cron from 'node-cron';
import Expense from '../models/Expense.js';

const processRecurringExpenses = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all recurring templates
    const recurringExpenses = await Expense.find({ isRecurring: true });

    for (let expense of recurringExpenses) {
      if (!expense.lastGeneratedDate) continue;

      let lastDate = new Date(expense.lastGeneratedDate);
      lastDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      let shouldGenerate = false;

      if (expense.recurringFrequency === 'daily' && daysDiff >= 1) {
        shouldGenerate = true;
      } else if (expense.recurringFrequency === 'weekly' && daysDiff >= 7) {
        shouldGenerate = true;
      } else if (expense.recurringFrequency === 'monthly') {
        const nextMonthDate = new Date(lastDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        if (today >= nextMonthDate) {
          shouldGenerate = true;
        }
      }

      if (shouldGenerate) {
        const newExpense = new Expense({
          user: expense.user,
          amount: expense.amount,
          category: expense.category,
          date: today,
          description: expense.description,
          isRecurring: false, // Instances are not templates
          recurringFrequency: 'none',
        });

        await newExpense.save();

        // Update the template's lastGeneratedDate
        expense.lastGeneratedDate = today;
        await expense.save();
        console.log(`Generated recurring expense for ${expense.description}`);
      }
    }
  } catch (error) {
    console.error('Error processing recurring expenses:', error);
  }
};

export const initCronJobs = () => {
  // Run everyday at midnight
  cron.schedule('0 0 * * *', () => {
    console.log('Running recurring expense job...');
    processRecurringExpenses();
  });
};
