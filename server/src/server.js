import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from 'http';
import {Server} from 'socket.io';

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import initSocket from './sockets/socket.js'
import uploadRoutes from './routes/upload.routes.js';

// Connect to DB
connectDB();

// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/upload", uploadRoutes)

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.io
const io = new Server (server, {
  cors: {
    origin: "*",
  },
});

// Init socket logic
initSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server with Socket.io running on port ${PORT}`);
});
