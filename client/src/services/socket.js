import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Add connection event listeners
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("waiting", () => {
  console.log("Server: Waiting for a chat partner...");
});

socket.on("debug-status-response", (status) => {
  console.log("Server Status:", JSON.stringify(status, null, 2));
});

socket.on("peer-error", (error) => {
  console.error("Peer Error:", error);
});

// Debug helper
export const getConnectionStatus = () => {
  return {
    connected: socket.connected,
    id: socket.id,
    transport: socket.io.engine.transport.name,
  };
};

export const debugSocketStatus = () => {
  console.log("Current Socket Status:", getConnectionStatus());
  socket.emit("debug-status");
};

export default socket;
