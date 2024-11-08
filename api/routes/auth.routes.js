import express from "express";
import passport from "passport";
import {
  getUser,
  github,
  google,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
// Route to initiate Google authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Route to handle the Google OAuth callback and generate the JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  google // Your custom middleware to handle the response
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  github
);

router.get("/me", auth, getUser);

export default router;
