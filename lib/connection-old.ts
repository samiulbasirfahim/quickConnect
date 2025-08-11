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
    peer: RTCPeerConnection | null;
    private username: string | null;
    stream: MediaStream | null;
    private otherPerson: string | null;
    remoteStream: unknown | null;

    constructor() {
        this.socket = null;
        this.peer = null;
        this.username = null;
        this.stream = null;
        this.otherPerson = null;
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
            this.socket = io("http://192.168.0.100:3000", {
                query: {
                    username: this.username,
                },
            });
            this.peer = new RTCPeerConnection(config);

            this.socket.on("room-created", this.handleRoomCreated.bind(this));
            this.socket.on("error", this.handleError.bind(this));
            this.socket.on("existing-users", this.handleRoomJoined.bind(this));
            this.socket.on("user-joined", this.handleNewJoin.bind(this));

            this.socket.on("offer", this.handleOffer.bind(this));
            this.socket.on("answer", this.handleAnswer.bind(this));

            this.socket.on("ice-candidate", ({ candidate }) => {
                this.peer?.addIceCandidate(new RTCIceCandidate(candidate));
            });

            this.peer?.addEventListener("icecandidate", (event: any) => {
                if (event.candidate) {
                    console.log("Sending ICE Candidate to", this.otherPerson);
                    this.socket?.emit("ice-candidate", {
                        candidate: event.candidate,
                        to: this.otherPerson,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async start() {
        this.stream = await mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });

        this.stream.getTracks().forEach((track) => {
            this.peer?.addTrack(track);
        });
    }

    private async handleNewJoin({
        socketID,
    }: {
        socketID: string;
        username: string;
    }) {
        this.otherPerson = socketID;
        console.log("OTHER PERSON from handle new join: ", this.otherPerson);
        await this.start();
        try {
            const offer = await this.peer?.createOffer();
            await this.peer?.setLocalDescription(offer);

            this.socket?.emit("offer", {
                to: socketID,
                offer,
            });
        } catch (err) {
            console.log(err);
        }
    }

    private handleAnswer = async (data: {
        answer: RTCSessionDescriptionInit | RTCSessionDescription;
        from: string;
    }) => {
        const { answer } = data;
        await this.peer?.setRemoteDescription(answer);
    };

    private handleOffer = async (data: OfferData) => {
        try {
            const { offer, from } = data;
            this.otherPerson = from;
            await this.start();

            await this.peer?.setRemoteDescription(offer);
            const answer = await this.peer?.createAnswer();
            await this.peer?.setLocalDescription(answer);

            this.socket?.emit("answer", {
                answer,
                to: from,
            });
        } catch (err) {
            console.log(err);
        }
    };
    private async handleRoomCreated({ roomID }: { roomID: string }) {
        router.push({
            pathname: "/room",
            params: {
                roomID,
            },
        });
    }

    private async handleRoomJoined({ roomID }: { roomID: string }) {
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
