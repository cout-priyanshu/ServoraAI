import mongoose from "mongoose";

const mongo_Url = process.env.MONGODB_URL;

if (!mongo_Url) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cache = (global as any).mongoose;

if (!cache) {
  cache = (global as any).mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  // If already connected, return cached connection
  if (cache.conn) {
    return cache.conn;
  }

  // If no connection promise exists, create one
  if (!cache.promise) {
    const opts = {
      bufferCommands: false, // Throws immediate error if connection fails instead of hanging for 10s
    };

    cache.promise = mongoose.connect(mongo_Url, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Assign to cache.conn, not a local variable
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    console.error("MongoDB Connection Failed:", error);
    throw error;
  }

  return cache.conn;
  
};

export default connectDb;