import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.DB_URI) return console.log("Está faltando MONGODB_URL");

  if (isConnected) {
    return console.log("MongoDB already connected!!!!!!!");
  }

  try {
    await mongoose.connect(process.env.DB_URI!, { dbName: "shopnxt" });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connect failed", err);
  }
};
