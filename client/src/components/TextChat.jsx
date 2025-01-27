import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../services/socket";
import { addMessage } from "../store/slices/chatSlice";

const TextChat = ({ chatId, isConnected, onSendMessage, connectionStatus }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    console.log("💬 TextChat: Sending message:", message);
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === "connected" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <h3 className="text-gray-700 font-medium">
            {connectionStatus === "connected"
              ? "Connected"
              : "Waiting for connection..."}
          </h3>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] break-words ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-gray-200 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
              } px-4 py-2 shadow-sm`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              connectionStatus === "connected"
                ? "Type a message..."
                : "Waiting for connection..."
            }
            disabled={connectionStatus !== "connected"}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={connectionStatus !== "connected"}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              connectionStatus === "connected"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextChat;
