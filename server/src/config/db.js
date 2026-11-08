import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows / ISP DNS blocking SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if restricted
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<username>") || uri.includes("password@cluster0")) {
    console.warn("\n⚠️  [Revora AI Database Warning]: MONGODB_URI is using a placeholder string.");
    console.warn("👉 Please provide your real MongoDB Atlas connection string in 'server/.env'.\n");
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn("⚠️  Operating in offline/diagnostic mode until Atlas connection string is configured.");
    return null;
  }
};
