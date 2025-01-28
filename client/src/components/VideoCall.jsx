const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
    // You might want to add TURN servers for better connectivity
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'credential'
    // }
  ],
  iceCandidatePoolSize: 10,
};

// Use this configuration in your RTCPeerConnection
const peerConnection = new RTCPeerConnection(configuration);
