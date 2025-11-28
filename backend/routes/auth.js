import { Router } from 'express';
import passport from 'passport';

const router = Router();

// FRONTEND URLS (controlled by environment)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const LOGOUT_REDIRECT = process.env.LOGOUT_REDIRECT || "http://localhost:5173";

// =====================
// 1. START GOOGLE LOGIN
// =====================
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// =====================
// 2. GOOGLE CALLBACK
// =====================
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_URL}/login`,
    session: true
  }),
  (req, res) => {
    // Redirect to your frontend after successful Google login
    res.redirect(CLIENT_URL);
  }
);

// =====================
// 3. LOGOUT
// =====================
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect(LOGOUT_REDIRECT);
  });
});

// =====================
// 4. GET CURRENT USER
// =====================
router.get('/user', (req, res) => {
  res.json(req.user || null);
});

export default router;
