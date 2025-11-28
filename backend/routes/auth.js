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
    failureRedirect: 'https://bookingwebapp-6ls7.onrender.com/login',
    session: true,
  }),
  (req, res) => {
    // Redirect user to the frontend deployed URL
    res.redirect('https://bookingwebapp-6ls7.onrender.com');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    // Redirect to frontend
    res.redirect('https://bookingwebapp-6ls7.onrender.com');
  });
});

// Check current user
router.get('/user', (req, res) => {
  res.json(req.user || null);
});

export default router;
