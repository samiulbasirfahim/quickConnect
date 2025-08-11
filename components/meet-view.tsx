import { connection } from "@/lib/connection";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";

export function MeetView() {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const handleTrack = (event: any) => {
            console.log("Received remote stream");
            setRemoteStream(event.streams[0]);
        };

        const setupConnection = () => {
            if (connection.peer) {
                connection.peer.addEventListener("track", handleTrack);
                console.log("Track listener added");
            }

            if (connection.stream) {
                setLocalStream(connection.stream);
                console.log("Local stream set");
            }
        };

        setupConnection();

        const checkInterval = setInterval(() => {
            if (connection.peer && !connection.peer.hasEventListener?.("track")) {
                setupConnection();
                console.log("STILL WAITING");
                clearInterval(checkInterval);
            }
        }, 500);

        return () => {
            clearInterval(checkInterval);
            connection.peer?.removeEventListener("track", handleTrack);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>VIDEO CALL</Text>

            {remoteStream ? (
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={styles.remoteView}
                    objectFit="cover"
                />
            ) : (
                <View style={styles.waitingView}>
                    <Text style={styles.waitingText}>Waiting for other person...</Text>
                </View>
            )}

            {localStream && (
                <RTCView
                    streamURL={localStream.toURL()}
                    style={styles.localView}
                    objectFit="cover"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        padding: 20,
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    remoteView: {
        flex: 1,
        backgroundColor: "#333",
    },
    localView: {
        position: "absolute",
        top: 100,
        right: 20,
        width: 120,
        height: 160,
        backgroundColor: "#333",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "white",
    },
    waitingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
    },
    waitingText: {
        color: "white",
        fontSize: 16,
    },
});
