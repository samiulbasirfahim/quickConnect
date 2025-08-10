import { io, Socket } from "socket.io-client";
import { RTCPeerConnection } from "react-native-webrtc";

export class Connection {
    private socket: Socket | null;
    private peer: RTCPeerConnection | null;

    constructor() {
        this.socket = null;
        this.peer = null;
    }

    setup(username: string) {
        const config: RTCConfiguration = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        };

        try {
            this.socket = io("http://192.168.0.100:3000", {
                query: {
                    username,
                },
            });
            this.peer = new RTCPeerConnection(config);
        } catch (err) {
            console.log(err);
        }
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
