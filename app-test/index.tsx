import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import {
    mediaDevices,
    MediaStream,
    RTCPeerConnection,
    RTCView,
} from "react-native-webrtc";

export default function Index() {
    const peer = useRef<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const setup = async () => {
        peer.current = new RTCPeerConnection();
        const streams = await mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(streams);
    };

    useEffect(() => {
        if (peer.current === null) setup();
    }, []);

    return (
        <View>
            <RTCView
                streamURL={localStream?.toURL()}
                style={{
                    borderWidth: 2,
                    width: 200,
                    height: 200,
                    transform: [{ rotate: "180deg" }],
                }}
                objectFit="cover"
            />
            <Text>HELLO</Text>
        </View>
    );
}
