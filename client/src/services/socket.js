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
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
