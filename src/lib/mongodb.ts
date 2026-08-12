import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Invalid/Missing environment variable: 'MONGODB_URI'. Please define MONGODB_URI in your .env.local file."
  );
}

/**
 * Global cache interface for serverless hot-reload connection caching
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      autoIndex: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((m) => {
        console.log("Successfully connected to MongoDB Atlas database.");
        return m;
      })
      .catch((err) => {
        console.error("MongoDB Atlas Connection Failed:", err.message);
        cached.promise = null;
        throw new Error(`Database connection failed: ${err.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
