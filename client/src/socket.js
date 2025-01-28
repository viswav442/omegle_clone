import io from "socket.io-client";

// In production, socket will connect to the same URL as the app
const SOCKET_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

const socket = io(SOCKET_URL, {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

export { socket };
