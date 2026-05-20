import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  // Bypassing authentication for rapid development
  let user = await User.findOne({ email: 'demo@example.com' });
  
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demopassword123',
    });
  }
  
  req.user = user;
  next();
});
