import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connect from "./config/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import {
  GithubAuthStrategy,
  GoogleAuthStrategy,
} from "./config/strategy.config.js";

dotenv.config();
GithubAuthStrategy(passport);
GoogleAuthStrategy(passport);

connect();
const app = express();
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
