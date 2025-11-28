import { Router } from "express";
import passport from "passport";

const router = Router();

// ====== ENV VARIABLES ======
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:3000";

// ===========================
//  GOOGLE LOGIN ROUTE
// ===========================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ===========================
//  GOOGLE CALLBACK ROUTE
// ===========================
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: true,
  }),
  (req, res) => {
    // SUCCESS → redirect to frontend
    res.redirect(FRONTEND_URL);
  }
);

// ===========================
//  LOGOUT
// ===========================
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.redirect(FRONTEND_URL);
  });
});

// ===========================
//  GET LOGGED-IN USER
// ===========================
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

export default router;
