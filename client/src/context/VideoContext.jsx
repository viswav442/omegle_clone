import { createContext, useContext, useState } from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [stream, setStream] = useState(null);
  const [peerStream, setPeerStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("idle");

  const value = {
    stream,
    setStream,
    peerStream,
    setPeerStream,
    isConnected,
    setIsConnected,
    connectionStatus,
    setConnectionStatus,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}
