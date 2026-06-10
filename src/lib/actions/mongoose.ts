import mongoose from "mongoose";

const uri = process.env.MONGODB_URL;

export const connectToDatabase = async () => {
  if (!uri) return console.log("Está faltando MONGODB_URL");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connect failed", err);
  }
};
