import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connect from "./config/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import {
  GithubAuthStrategy,
  GoogleAuthStrategy,
} from "./config/strategy.config.js";

dotenv.config();
GithubAuthStrategy(passport);
GoogleAuthStrategy(passport);

connect();
const __dirname = path.resolve();

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

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
