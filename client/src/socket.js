import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.PROD
  ? window.location.origin.replace(/^http/, "ws") // Use WebSocket in production
  : "http://localhost:8080";

export const socket = io(ENDPOINT, {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
});

// Add connection event listeners
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
