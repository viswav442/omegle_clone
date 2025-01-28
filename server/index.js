const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? true // Allow all origins in production
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
  pingTimeout: 60000,
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
