import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import auth from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import rateLimiter from "./lib/ratelimit.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(rateLimiter);

app.use(session({
  secret: process.env.SESSION_SECRET || "TOPSECRETWORD",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,        // because Render uses HTTPS
    httpOnly: true, 
    sameSite: "none"     // THIS IS THE FIX ❗
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/api/blocks", productRoutes);
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
