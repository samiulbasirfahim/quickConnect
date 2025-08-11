import { router } from "expo-router";
import { mediaDevices, MediaStream } from "react-native-webrtc";
import { io, Socket } from "socket.io-client";

interface PeerData {
    connection: RTCPeerConnection;
    remoteStream: MediaStream | null;
    username: string;
}

class Connections {
    private socket: Socket | null = null;
    private username: string | null = null;
    private userID: string | null = null;
    roomID: string | null = null;

    private peers: Map<string, PeerData> = new Map();
    private currentRoom: string | null = null;
    private rtcConfig: RTCConfiguration = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
        ],
    };

    setup_socket(username: string) {
        if (this.username !== username) {
            this.socket?.close();
            this.username = null;
            this.socket = null;
            this.userID = null;
        } else {
            return console.log("Already setup with this username.");
        }
        this.username = username;
        this.socket = io("http://10.10.13.83:5055", {
            query: {
                username,
            },
        });

        this.socket.on("connect", () => {
            this.userID = String(this.socket?.id ?? "");
            console.log(`Connected as ${this.username} with ID: ${this.userID}`);
        });

        this.socket.on("disconnect", (reason) => {
            console.log(`Disconnected: ${reason}`);
            this.userID = null;
        });

        this.socket.on("connect_error", (err) => {
            console.error("Connection failed:", err.message);
        });

        this.socket.on("room-created", ({ roomID }: { roomID: string }) => {
            this.roomID = roomID;
            router.push("/room");
        });
    }

    createRoom = () => this.socket?.emit("create-room");

    joinRoom = (roomID: string) => {
        this.socket?.emit("join-room", {
            roomID,
        });
    };

    start_stream = async (config: { video: boolean; audio: boolean }) => {
        const streams = await mediaDevices.getUserMedia(config);
    };
}

export const connection = new Connections();
