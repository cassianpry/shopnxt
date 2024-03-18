//@ts-nocheck
import mongoose from "mongoose";

// import { MongoClient, ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const uri = process.env.MONGODB_URL;
//const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  // mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.log("Está faltando MONGODB_URL");

  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
    });
    //await client.connect();
    // await client.db("admin").command({ ping: 1 });

    // await mongoose.connect(process.env.MONGODB_URL);
    // isConnected = true;
    // console.log(
    //   "MongoDB connected",
    //   await client.db("shopnxt").command({ ping: 1 })
    // );
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connect failed", err);
  }
};
