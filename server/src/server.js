import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  // Start HTTP Listener
  app.listen(PORT, () => {
    console.log(`🚀 [Revora AI Server Running]: http://localhost:${PORT}`);
    console.log(`📡 [API Health Endpoint]: http://localhost:${PORT}/health`);
    console.log(`🛡️  [Policy Guardian Engine]: Active`);
  });
};

startServer();
