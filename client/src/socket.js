import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.PROD
  ? window.location.origin // This will use the same origin as your app
  : "http://localhost:5000";

export const socket = io(ENDPOINT, {
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
  rejectUnauthorized: false,
  withCredentials: true,
});

// Add connection event listeners
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (err) => {
  console.log("Socket connection error:", err);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
