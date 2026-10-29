import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas, Local MongoDB instance, or fallback to MongoMemoryServer
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim() || "mongodb://127.0.0.1:27017/campusconnect";

  try {
    const options = {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    };

    const conn = await mongoose.connect(mongoUri, options);

    console.log(`MongoDB connected successfully`);
    console.log(`Database Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.warn("MongoDB connection failed for configured MONGO_URI:", error.message);
    console.log("Initializing in-memory MongoDB server (mongodb-memory-server)...");

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();

      const conn = await mongoose.connect(memoryUri, {
        dbName: "campusconnect",
      });

      console.log(`In-memory MongoDB connected successfully`);
      console.log(`Database Host: ${conn.connection.host}`);
      console.log(`Database Name: ${conn.connection.name}`);

      return conn;
    } catch (fallbackError) {
      console.error("In-memory MongoDB fallback also failed:", fallbackError.message);
      throw error;
    }
  }
};

export default connectDB;

