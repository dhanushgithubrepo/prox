import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached = (global as any).mongoose as MongooseCache | undefined

if (!cached) {
  cached = { conn: null, promise: null }
  ;(global as any).mongoose = cached
}

export async function connectToDatabase() {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI)
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}

const waitingListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
)

export const WaitingList =
  (mongoose.models.WaitingList as mongoose.Model<{ email: string }>) ||
  mongoose.model("WaitingList", waitingListSchema)
