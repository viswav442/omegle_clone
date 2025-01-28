require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const setupSecurity = require("./middleware/security");
const errorHandler = require("./middleware/errorHandler");
const config = require("./config/config");
const Chat = require("./models/Chat");
const path = require("path");

// const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
setupSecurity(app);

// Track users and their states
const users = new Map();
const waitingUsers = new Set();
const activeChats = new Map();

io.on("connection", (socket) => {
  console.log(
    `[${new Date().toISOString()}] 👤 New user connected:`,
    socket.id
  );
  users.set(socket.id, {
    status: "online",
    joinedAt: Date.now(),
  });

  // Send current online count to all users
  io.emit("users-count", {
    total: users.size,
    waiting: waitingUsers.size,
    chatting: activeChats.size / 2,
  });

  socket.on("looking-for-chat", () => {
    console.log(
      `[${new Date().toISOString()}] 🔍 ${socket.id} is looking for chat`
    );

    // Remove from any existing chat
    if (activeChats.has(socket.id)) {
      const partnerId = activeChats.get(socket.id);
      activeChats.delete(socket.id);
      activeChats.delete(partnerId);
      io.to(partnerId).emit("peer-disconnected");
      users.set(partnerId, { status: "online", joinedAt: Date.now() });
    }

    // Remove from waiting if already there
    waitingUsers.delete(socket.id);

    // Get available users
    const availableUsers = Array.from(waitingUsers).filter((id) => {
      // Don't match with self or users already in chat
      return id !== socket.id && !activeChats.has(id);
    });

    if (availableUsers.length > 0) {
      // Randomly select a partner from available users
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const partnerId = availableUsers[randomIndex];

      console.log(
        `[${new Date().toISOString()}] ✅ Matching ${
          socket.id
        } with ${partnerId}`
      );

      // Remove partner from waiting list
      waitingUsers.delete(partnerId);

      // Create chat session
      const chatId = `chat_${Date.now()}`;
      activeChats.set(socket.id, partnerId);
      activeChats.set(partnerId, socket.id);

      // Update user statuses
      users.set(socket.id, { status: "chatting", partnerId, chatId });
      users.set(partnerId, {
        status: "chatting",
        partnerId: socket.id,
        chatId,
      });

      // Notify both users
      socket.emit("chat-started", { peer: partnerId, chatId });
      io.to(partnerId).emit("chat-started", { peer: socket.id, chatId });
    } else {
      // Add to waiting list
      console.log(
        `[${new Date().toISOString()}] ⏳ Adding ${socket.id} to waiting list`
      );
      waitingUsers.add(socket.id);
      users.set(socket.id, { status: "waiting", joinedAt: Date.now() });
      socket.emit("waiting");
    }

    // Update user counts
    io.emit("users-count", {
      total: users.size,
      waiting: waitingUsers.size,
      chatting: activeChats.size / 2,
    });
  });

  socket.on("signal", ({ signal, to }) => {
    console.log(
      `[${new Date().toISOString()}] Signal from ${socket.id} to ${to}:`,
      signal.type
    );
    io.to(to).emit("signal", { signal, from: socket.id });
  });

  socket.on("user-disconnected", () => {
    console.log(
      `[${new Date().toISOString()}] 🔌 User disconnected:`,
      socket.id
    );

    // Remove from any existing chat
    if (activeChats.has(socket.id)) {
      const partnerId = activeChats.get(socket.id);
      activeChats.delete(socket.id);
      activeChats.delete(partnerId);
      io.to(partnerId).emit("peer-disconnected");
      users.set(partnerId, { status: "online", joinedAt: Date.now() });
    }

    // Remove from waiting list
    waitingUsers.delete(socket.id);
    users.set(socket.id, { status: "online", joinedAt: Date.now() });

    // Update user counts
    io.emit("users-count", {
      total: users.size,
      waiting: waitingUsers.size,
      chatting: activeChats.size / 2,
    });
  });

  // Debug endpoint
  socket.on("debug-status", () => {
    const status = {
      yourId: socket.id,
      yourStatus: users.get(socket.id),
      totalUsers: users.size,
      waitingUsers: Array.from(waitingUsers),
      activeChats: Array.from(activeChats.entries()),
      yourPartner: activeChats.get(socket.id),
    };
    socket.emit("debug-status-response", status);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    users: users.size,
    waiting: waitingUsers.size,
    chatting: activeChats.size / 2,
  });
});

// Error handling
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
