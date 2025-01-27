const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [String],
  messages: [messageSchema],
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
});

module.exports = mongoose.model("Chat", chatSchema);
