import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Not required because users using Google OAuth might not have a password
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    age: { type: Number },
    profession: { type: String },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say'
    },
    phone: { type: String },
    avatar: { type: String, default: '👤' },
    currency: { type: String, default: 'INR' },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
