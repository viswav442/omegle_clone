import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    // Use the same domain as the frontend in production
    return window.location.origin;
  }
  // Development URL
  return "http://localhost:5000";
};

export const socket = io(getSocketUrl(), {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  rejectUnauthorized: false,
  autoConnect: true,
  withCredentials: true,
});

// Add error logging
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  // If we were looking for a chat before disconnecting, start looking again
  if (socket.wasLooking) {
    socket.emit("looking-for-chat");
  }
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  // If the disconnection wasn't intentional, try to reconnect
  if (reason === "io server disconnect" || reason === "transport close") {
    socket.connect();
  }
});

// Add this to help track if user was looking for chat
export const startLooking = () => {
  socket.wasLooking = true;
  socket.emit("looking-for-chat");
};

export const stopLooking = () => {
  socket.wasLooking = false;
  socket.emit("user-disconnected");
};
