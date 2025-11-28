import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Start Google OAuth login flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + '/login',
    session: true
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL); 
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL);
  });
});

// Logged-in user
router.get('/user', (req, res) => {
  res.json(req.user || null);
});

export default router;
