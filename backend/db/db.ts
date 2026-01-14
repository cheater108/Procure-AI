import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URL= process.env.DB_URL ?? "";

const connectDB = async () => {
  try {
    console.log("[ConnectDB] - Connecting to MongoDB");
    await mongoose.connect(DB_URL, {
      dbName: "procure-ai"
    });
    console.log("[ConnectDB] - Connected to MongoDB");
  } catch (error) {
    console.log("[ConnectDB] - Failed to connect to MongoDB", error);
  }
}

export default connectDB;