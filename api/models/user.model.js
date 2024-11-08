import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is not required for OAuth users
    authType: {
      type: String,
      enum: ["email", "google", "github"],
      required: true,
    },
    googleId: { type: String, unique: true, sparse: true }, // Use sparse index to allow null values
    githubId: { type: String, unique: true, sparse: true },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/young-boy-avatar-illustration_1308-175931.jpg?t=st=1730988156~exp=1730991756~hmac=6f5bd2b0f2716524d9868005e92641686accdb086e27046988d8f2284b66fae3&w=740", // Default avatar image
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

// Compile the model
const User = mongoose.model("User", userSchema);

export default User;
