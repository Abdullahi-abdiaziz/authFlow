import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected sucessfully", db.connection.host);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDb;
