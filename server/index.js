const express = require("express");
const app = express();
const path = require("path");

// Add CSP headers middleware
app.use((req, res, next) => {
  // Get the host from the request
  const host = req.get("host");
  const wsProtocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
  const httpProtocol = process.env.NODE_ENV === "production" ? "https" : "http";

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; ` +
      `connect-src 'self' ${wsProtocol}://${host} ${httpProtocol}://${host} ws: wss: http: https: *; ` +
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'; ` +
      `style-src 'self' 'unsafe-inline'; ` +
      `media-src 'self' blob: mediastream:; ` +
      `img-src 'self' blob: data:;`
  );

  // Add other necessary security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
  path: "/socket.io/",
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Add error handling for socket connections
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // ... your existing socket event handlers ...
});

// Add error handling for the server
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Make sure this comes after all other routes
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
