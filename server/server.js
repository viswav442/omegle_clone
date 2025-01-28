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
const { Server } = require("socket.io");

// const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? true // Allow the request origin automatically
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  path: "/socket.io/",
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  allowEIO3: true,
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  next();
});
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

    // Get available users that are actually still connected
    const availableUsers = Array.from(waitingUsers).filter((id) => {
      return (
        id !== socket.id &&
        !activeChats.has(id) &&
        users.has(id) && // Make sure user still exists
        users.get(id).status === "waiting"
      ); // Make sure they're actually waiting
    });

    if (availableUsers.length > 0) {
      // Randomly select a partner from available users
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const partnerId = availableUsers[randomIndex];

      // Double check if partner is still connected
      if (!users.has(partnerId)) {
        waitingUsers.delete(partnerId);
        socket.emit("waiting");
        return;
      }

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

  socket.on("disconnect", () => {
    console.log(
      `[${new Date().toISOString()}] 👋 User disconnected:`,
      socket.id
    );

    // Remove from active chats and notify partner
    if (activeChats.has(socket.id)) {
      const partnerId = activeChats.get(socket.id);
      activeChats.delete(socket.id);
      activeChats.delete(partnerId);
      io.to(partnerId).emit("peer-disconnected");
      // Update partner status to online
      if (users.has(partnerId)) {
        users.set(partnerId, { status: "online", joinedAt: Date.now() });
      }
    }

    // Remove from waiting list
    waitingUsers.delete(socket.id);

    // Remove user completely
    users.delete(socket.id);

    // Update user counts for everyone
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
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Add a periodic cleanup function to remove stale users
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const staleTimeout = 30000; // 30 seconds

  // Clean up users who haven't had activity
  for (const [socketId, userData] of users.entries()) {
    if (
      now - userData.joinedAt > staleTimeout &&
      userData.status !== "chatting"
    ) {
      users.delete(socketId);
      waitingUsers.delete(socketId);
    }
  }

  // Clean up any waiting users that no longer exist in users Map
  for (const socketId of waitingUsers) {
    if (!users.has(socketId)) {
      waitingUsers.delete(socketId);
    }
  }

  // Clean up any active chats where one or both users no longer exist
  for (const [socketId, partnerId] of activeChats.entries()) {
    if (!users.has(socketId) || !users.has(partnerId)) {
      if (users.has(socketId)) {
        users.set(socketId, { status: "online", joinedAt: Date.now() });
      }
      if (users.has(partnerId)) {
        users.set(partnerId, { status: "online", joinedAt: Date.now() });
      }
      activeChats.delete(socketId);
      activeChats.delete(partnerId);
    }
  }

  // Update everyone with the new counts
  io.emit("users-count", {
    total: users.size,
    waiting: waitingUsers.size,
    chatting: activeChats.size / 2,
  });
}, 10000); // Run every 10 seconds

// Clean up the interval when the server shuts down
process.on("SIGTERM", () => {
  clearInterval(cleanupInterval);
  // ... other cleanup code ...
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
