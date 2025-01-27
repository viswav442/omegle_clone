import React, { useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { selectIsConnected, selectLoading } from "../store/slices/chatSlice";

const VideoChat = ({
  myVideo,
  peerVideo,
  onStartChat,
  mediaStream,
  isLoading,
  connectionStatus,
}) => {
  const isConnected = useAppSelector(selectIsConnected);
  const [hasMediaPermissions, setHasMediaPermissions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Update permission state when mediaStream changes
  React.useEffect(() => {
    if (mediaStream) {
      setHasMediaPermissions(true);
    }
  }, [mediaStream]);

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case "searching":
        return "Looking for someone to chat with...";
      case "connecting":
        return "Connecting to peer...";
      case "connected":
        return "Connected";
      case "failed":
        return "Connection failed. Please try again.";
      case "disconnected":
        return "Disconnected from server";
      default:
        return "Click Start Chat to begin";
    }
  };

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleDisconnect = () => {
    // Stop all tracks in the media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    // Stop peer video
    if (peerVideo.current) {
      const stream = peerVideo.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      peerVideo.current.srcObject = null;
    }

    // Refresh the page to reset the connection
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Video */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={myVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={peerVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              {connectionStatus === "searching" ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-white text-sm">Looking for someone...</p>
                </>
              ) : connectionStatus === "connecting" ? (
                <>
                  <div className="animate-pulse">
                    <div className="h-8 w-8 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  </div>
                  <p className="text-white text-sm">Connecting...</p>
                </>
              ) : connectionStatus === "connected" ? null : (
                <p className="text-white text-sm">Waiting to start</p>
              )}
            </div>
          </div>
          {connectionStatus === "connected" && (
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
              Peer
            </div>
          )}
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          {isMuted ? "🔇" : "🎤"}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          {isVideoOff ? "📵" : "📹"}
        </button>
        {connectionStatus === "connected" ? (
          <button
            onClick={handleDisconnect}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            End Chat
          </button>
        ) : (
          <button
            onClick={onStartChat}
            disabled={isLoading || connectionStatus === "connecting"}
            className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
              isLoading || connectionStatus === "connecting"
                ? "bg-gray-400 cursor-not-allowed"
                : connectionStatus === "searching"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } shadow-lg`}
          >
            {isLoading
              ? "Loading..."
              : connectionStatus === "searching"
              ? "Finding Someone..."
              : connectionStatus === "connecting"
              ? "Connecting..."
              : "Start Chat"}
          </button>
        )}
      </div>

      {/* Connection Status */}
      <div className="text-center">
        <p
          className={`text-sm ${
            connectionStatus === "connected"
              ? "text-green-500"
              : connectionStatus === "searching"
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          {connectionStatus === "connected"
            ? "🟢 Connected"
            : connectionStatus === "searching"
            ? "🔄 Searching..."
            : connectionStatus === "connecting"
            ? "🔗 Establishing connection..."
            : "⚪ Not connected"}
        </p>
      </div>
    </div>
  );
};

export default VideoChat;
