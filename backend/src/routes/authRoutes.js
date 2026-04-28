import express from 'express';
import passport from 'passport';
import { authUser, registerUser, googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

// Google OAuth initiate
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google OAuth callback
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error("Passport Auth Error:", err);
        return res.redirect(`${process.env.FRONTEND_URL || 'https://track-my-rupee.vercel.app'}/login?error=oauth_error`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://track-my-rupee.vercel.app'}/login?error=auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

export default router;
