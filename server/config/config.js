require("dotenv").config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/omegle-clone",
  },
  server: {
    port: process.env.PORT || 5000,
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

module.exports = config;
