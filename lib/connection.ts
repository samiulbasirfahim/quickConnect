import { io, Socket } from "socket.io-client";
import { RTCPeerConnection } from "react-native-webrtc";
import { router } from "expo-router";

export class Connection {
    private socket: Socket | null;
    private peer: RTCPeerConnection | null;
    private username: string | null;

    constructor() {
        this.socket = null;
        this.peer = null;
        this.username = null;
    }

    setup(username: string) {
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
            this.socket = io("http://192.168.0.100:3000", {
                query: {
                    username,
                },
            });
            this.peer = new RTCPeerConnection(config);

            this.socket.on("room-created", ({ roomID }: { roomID: string }) => {
                router.push({
                    pathname: "/room",
                    params: {
                        roomID,
                    },
                });
            });
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
