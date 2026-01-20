import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const onlineUsers = new Map(); // socketId -> { userId, name, roomId }

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Socket auth failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.name);

    socket.on("join_room", async (roomId) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`${socket.user.name} joined room ${roomId}`);

      // track online user
      onlineUsers.set(socket.id, {
        userId: socket.user._id.toString(),
        name: socket.user.name,
        roomId,
      });

      // send online users to room
      const usersInRoom = [...onlineUsers.values()].filter(
        (u) => u.roomId === roomId
      );
      io.to(roomId).emit("online_users", usersInRoom);

      // load last 50 messages
      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      socket.emit("old_message", messages.reverse());
    });

    // send new text message
    socket.on("send_message", async ({ roomId, text }) => {
      if (!roomId || !text) return;

      const msg = await Message.create({
        roomId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        type: "text",
        content: text,
      });

      io.to(roomId).emit("new_message", msg);
    });

    // typing start
    socket.on("typing", ({ roomId }) => {
      if (!roomId) return;

      socket.to(roomId).emit("user_typing", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    // typing stop
    socket.on("stop_typing", ({ roomId }) => {
      if (!roomId) return;

      socket.to(roomId).emit("user_stop_typing", {
        userId: socket.user._id,
      });
    });

    // send image
    socket.on("send_image", async ({ roomId, imageUrl }) => {
      if (!roomId || !imageUrl) return;

      const msg = await Message.create({
        roomId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        type: "image",
        content: imageUrl,
      });

      io.to(roomId).emit("new_message", msg);
    });

    socket.on("disconnect", () => {
      const info = onlineUsers.get(socket.id);
      if (info) {
        onlineUsers.delete(socket.id);

        const usersInRoom = [...onlineUsers.values()].filter(
          (u) => u.roomId === info.roomId
        );
        io.to(info.roomId).emit("online_users", usersInRoom);
      }

      console.log("User disconnected:", socket.user.name);
    });
  });
};

export default initSocket;
