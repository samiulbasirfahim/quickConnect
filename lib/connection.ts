import { MediaStream } from "react-native-webrtc";
import { Socket } from "socket.io-client";

interface PeerData {
  connection: RTCPeerConnection;
  remoteStream: MediaStream | null;
  username: string;
}

class Connections {
  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private peers: Map<string, PeerData> = new Map();

  private currentRoom: string | null = null;
  private userID: string | null = null;
  private username: string | null = null;

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
}
