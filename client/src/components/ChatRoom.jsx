import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Peer from "simple-peer";
import { socket } from "../services/socket";
import {
  startChat,
  chatConnected,
  chatDisconnected,
  addMessage,
} from "../store/slices/chatSlice";
import VideoChat from "./VideoChat";
import TextChat from "./TextChat";

function ChatRoom() {
  const dispatch = useAppDispatch();
  const {
    isConnected,
    peer: peerId,
    chatId,
  } = useAppSelector((state) => state.chat);
  const [stream, setStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    waiting: 0,
    chatting: 0,
  });

  const myVideo = useRef();
  const peerVideo = useRef();
  const streamRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        streamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
        setIsMediaLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get media devices:", err);
        setIsMediaLoading(false);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const logPeerState = () => {
    console.log("Peer State:", {
      hasPeerRef: !!peerRef.current,
      hasStream: !!streamRef.current,
      streamTracks: streamRef.current?.getTracks().map((t) => t.kind),
      peerConnectionState: peerRef.current?.connected,
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("waiting", () => {
      console.log("⏳ Server: Waiting for a chat partner...");
      setConnectionStatus("searching");
    });

    socket.on("chat-started", ({ peer: remotePeerId, chatId }) => {
      console.log("🎯 Chat started with peer:", remotePeerId);
      setConnectionStatus("connecting");

      try {
        const isInitiator = socket.id > remotePeerId;
        console.log(
          `Creating peer as ${isInitiator ? "initiator" : "receiver"}`
        );

        const peer = new Peer({
          initiator: isInitiator,
          stream: streamRef.current,
          trickle: false,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          },
        });

        peer.on("data", (data) => {
          try {
            console.log("📨 Received raw data:", data.toString());
            const message = JSON.parse(data.toString());
            console.log("📨 Parsed message:", message);

            if (message.type === "chat") {
              dispatch(
                addMessage({
                  text: message.text,
                  sender: "peer",
                  timestamp: message.timestamp,
                })
              );
            }
          } catch (err) {
            console.error("❌ Error processing received data:", err);
          }
        });

        peer.on("signal", (data) => {
          console.log("📤 Sending signal:", data.type);
          socket.emit("signal", { signal: data, to: remotePeerId });
        });

        peer.on("connect", () => {
          console.log(
            "🤝 Peer connection established! Ready for data transfer"
          );
          setConnectionStatus("connected");

          try {
            peer.send(
              JSON.stringify({
                type: "chat",
                text: "Test message",
                timestamp: new Date().toISOString(),
              })
            );
            console.log("📤 Test message sent");
          } catch (err) {
            console.error("❌ Error sending test message:", err);
          }
        });

        peer.on("stream", (stream) => {
          console.log("📺 Received peer stream");
          if (peerVideo.current) {
            peerVideo.current.srcObject = stream;
          }
        });

        peer.on("error", (err) => {
          console.error("❌ Peer Error:", err);
          setConnectionStatus("failed");
        });

        peerRef.current = peer;
        dispatch(chatConnected({ peer: remotePeerId, chatId }));
      } catch (err) {
        console.error("❌ Error creating peer:", err);
        setConnectionStatus("failed");
      }
    });

    socket.on("signal", ({ signal, from }) => {
      console.log("📥 Received signal:", signal.type, "from:", from);

      try {
        if (!peerRef.current) {
          return; // We should already have a peer from chat-started
        }

        console.log("➡️ Applying signal to peer");
        peerRef.current.signal(signal);
      } catch (err) {
        console.error("❌ Error handling signal:", err);
        setConnectionStatus("failed");
      }
    });

    socket.on("users-count", (counts) => {
      setUserCounts(counts);
    });

    return () => {
      socket.off("connect");
      socket.off("waiting");
      socket.off("chat-started");
      socket.off("signal");
      socket.off("users-count");
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [dispatch]);

  const handleStartChat = useCallback(() => {
    console.log("Start Chat clicked");

    if (isMediaLoading || !streamRef.current) {
      console.log("Media not ready");
      return;
    }

    // Clean up any existing peer
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    console.log("Emitting looking-for-chat event");
    setConnectionStatus("searching");
    dispatch(startChat());
    socket.emit("looking-for-chat");
  }, [dispatch, isMediaLoading]);

  const handleSendMessage = useCallback(
    (message) => {
      console.log("💬 Attempting to send message:", message);

      if (!peerRef.current) {
        console.error("❌ No peer connection available");
        return;
      }

      if (!peerRef.current.connected) {
        console.error("❌ Peer connection not established");
        return;
      }

      try {
        const messageData = {
          type: "chat",
          text: message,
          timestamp: new Date().toISOString(),
        };

        console.log("📤 Sending message data:", messageData);
        peerRef.current.send(JSON.stringify(messageData));

        // Add message to local state
        dispatch(
          addMessage({
            text: message,
            sender: "me",
            timestamp: messageData.timestamp,
          })
        );

        console.log("✅ Message sent successfully");
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="w-full">
            <VideoChat
              myVideo={myVideo}
              peerVideo={peerVideo}
              onStartChat={handleStartChat}
              mediaStream={stream}
              isLoading={isMediaLoading}
              connectionStatus={connectionStatus}
            />
          </div>
          <div className="w-full">
            <TextChat
              chatId={chatId}
              isConnected={isConnected}
              onSendMessage={handleSendMessage}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Online:</span> {userCounts.total}
              </div>
              <div>
                <span className="font-medium">Waiting:</span>{" "}
                {userCounts.waiting}
              </div>
              <div>
                <span className="font-medium">In Chat:</span>{" "}
                {userCounts.chatting * 2}
              </div>
            </div>
            {/* <button
              onClick={() => {
                console.log("🔍 Debug Info:", {
                  connectionStatus,
                  peerConnected: peerRef.current?.connected,
                  hasPeer: !!peerRef.current,
                  isConnected,
                });
              }}
              className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Debug Connection
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
