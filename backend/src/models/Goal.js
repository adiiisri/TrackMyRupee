import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  savedAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  icon: {
    type: String,
    default: 'Target',
  },
  color: {
    type: String,
    default: 'var(--accent-primary)',
  }
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
