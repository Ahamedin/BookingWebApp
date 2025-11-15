import express from 'express';
 
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
// import router from './routes';
import passport from "passport";
import './config/passport.js';
import auth from "./routes/auth.js"

import productRoutes from "./routes/productRoutes.js";
import rateLimiter from "./lib/ratelimit.js";
import path from "path";


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000
const __dirname = path.resolve();

app.use(cors({ 
  origin: ["https://bookingwebapp-6ls7.onrender.com/"],
  credentials: true 
}));

app.use(express.json())
app.use(rateLimiter)
app.use(session({
  secret: process.env.SESSION_SECRET || "TOPSECRETWORD",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 *24,
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/blocks", productRoutes);
app.use("/auth", auth);

if(process.env.NODE_ENV==="production"){
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

}

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
});