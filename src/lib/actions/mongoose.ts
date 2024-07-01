//@ts-nocheck
import mongoose from "mongoose";

// import { MongoClient, ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const uri = process.env.MONGODB_URL;
//const client = new MongoClient(uri);

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_LOCAL)
    return console.log("Está faltando MONGODB_URL");

  try {
    // if (process.env.NODE_ENV === "production") {
    await mongoose.connect(uri);
    // } else {
    // await mongoose.connect(process.env.MONGODB_LOCAL, { dbName: "shopnxt" });
    // }
    //await client.connect();
    // await client.db("admin").command({ ping: 1 });

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
