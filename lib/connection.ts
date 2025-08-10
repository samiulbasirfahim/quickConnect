import { io, Socket } from "socket.io-client";
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  type RTCSessionDescription,
} from "react-native-webrtc";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";
import { type RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";

interface OfferData {
  offer: RTCSessionDescriptionInit | RTCSessionDescription;
  from: string;
}

export class Connection {
  private socket: Socket | null;
  private peer: RTCPeerConnection | null;
  private username: string | null;
  private stream: MediaStream | null;

  constructor() {
    this.socket = null;
    this.peer = null;
    this.username = null;
    this.stream = null;
  }

  async setup(username: string) {
    if (this.username === username && this.peer && this.socket) {
      // console.log("No need to re-initialize");
      return;
    }
    this.username = username;

    const config: RTCConfiguration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    try {
      this.socket = io("http://192.168.0.115:3000", {
        query: {
          username,
        },
      });
      this.peer = new RTCPeerConnection(config);

      this.stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      this.stream.getTracks().forEach((track) => {
        this.peer?.addTrack(track);
      });

      this.socket.on("room-created", this.handleRoomCreated);
      this.socket.on("error", this.handleError);
      this.socket.on("existing-users", this.handleRoomJoined);
      this.socket.on("user-joined", this.handleNewJoin);
      this.socket.on("offer", this.handleOffer);
      this.socket.on("answer", this.handleAnswer);

      this.peer["onicecandidate"] = (event: any) => {
          console.log("ICE CANDIDATE")
        if (event.candidate) {
          this.socket?.emit("ice-candidate", {
            candidate: event.candidate,
            to: "",
          });
        }
      };
    } catch (err) {
      console.log(err);
    }
  }

  private async handleNewJoin({
    socketID,
    username,
  }: {
    socketID: string;
    username: string;
  }) {
    const offer = await this.peer?.createOffer();
    await this.peer?.setLocalDescription(offer);

    this.socket?.emit("offer", {
      to: socketID,
      offer,
    });
  }

  private handleAnswer = async (data: {
    answer: RTCSessionDescriptionInit | RTCSessionDescription;
    from: string;
  }) => {
    const { answer } = data;
    await this.peer?.setRemoteDescription(answer);
  };

  private handleOffer = async (data: OfferData) => {
    const { offer, from } = data;

    await this.peer?.setRemoteDescription(offer);
    const answer = await this.peer?.createAnswer();
    await this.peer?.setLocalDescription(answer);

    this.socket?.emit("answer", {
      answer,
      to: from,
    });
  };
  private handleRoomCreated({ roomID }: { roomID: string }) {
    router.push({
      pathname: "/room",
      params: {
        roomID,
      },
    });
  }

  private handleRoomJoined({ roomID }: { roomID: string }) {
    router.push({
      pathname: "/room",
      params: {
        roomID,
      },
    });
  }

  private handleError({ message }: { message: string }) {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }

  createRoom() {
    this.socket?.emit("create-room", {});
  }
  joinRoom(roomID: string) {
    this.socket?.emit("join-room", {
      roomID,
    });
  }
}

export const connection = new Connection();
