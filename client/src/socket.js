import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}`;
  }
  return "http://localhost:5000";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
  rejectUnauthorized: false,
  withCredentials: true,
});

// Add connection event listeners
socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
