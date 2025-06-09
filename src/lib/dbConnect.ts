import mongoose from "mongoose";

declare global {
  var mongooseConnection: number | undefined;
}

// Try to reuse a previous connection stored in global memory
let isConnected: number | undefined = global.mongooseConnection;

async function dbConnect(): Promise<void> {
  // ✅ If already connected, don't connect again
  if (isConnected) {
    console.log("✅ Already connected");
    return;
  }

  try {
    // 🔌 Try to connect to MongoDB using the URI from .env file
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    // 🟢 Save the connection status (1 means connected)
    isConnected = db.connections[0].readyState;

    // 💾 Save it in global memory, so we can reuse it next time
    global.mongooseConnection = isConnected;

    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ DB connection error:", error);
    process.exit(1); // 🛑 Stop the server if connection fails
  }
}

export default dbConnect;
