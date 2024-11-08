import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRandomPassword } from "../middleware/auth.middleware.js";

export const register = async (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  let user = new User({
    email,
    password: hashedPassword,
    name,
    authType: "email",
  });
  await user.save();

  user = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  // Generate and send a JWT token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user with the provided email exists
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if the provided password matches the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  user = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  // Generate and send a JWT token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
};

export const logout = async (req, res, next) => {
  // Clear the token from the client-side (e.g., by removing it from local storage)

  // and send a response indicating successful logout
  res.json({ message: "Logged out successfully" });
};

export const getUser = async (req, res, next) => {
  return res.json(req.user);
};

export const google = async (req, res, next) => {
  try {
    const { user, token } = req.user; // Destructure user and token from req.user

    // Check if the user exists in your database
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Generate a random password and hash it
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save a new user
      existingUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        authType: "google",
        avatar: user.avatar,
      });
      await existingUser.save();
    }

    // Respond with the token
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Ensure it's true in production
      maxAge: 3600 * 1000, // 1 hour
    });

    // Redirect or respond with a success message
    res.redirect("/dashboard"); // Or respond with a success JSON if needed
    // res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const github = async (req, res, next) => {
  try {
    const { user, token } = req.user; // Destructure user and token from req.user

    // Check if the user exists in your database
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Generate a random password and hash it
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save a new user
      existingUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        authType: "github",
        avatar: user.avatar,
      });
      await existingUser.save();
    }

    // Respond with the token
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Ensure it's true in production
      maxAge: 3600 * 1000, // 1 hour
    });

    // Redirect or respond with a success message
    return res.redirect("/dashboard"); // Or respond with a success JSON if needed
    // res.json({ token });
  } catch (error) {
    next(error);
  }
};
