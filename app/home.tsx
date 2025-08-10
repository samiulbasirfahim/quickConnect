import { connection } from "@/lib/connection";
import { Link } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import {
    Pressable,
    Text,
    View,
    Image,
    TouchableHighlight,
    Modal,
} from "react-native";
import BG from "../assets/images/home-bg.png";

export default function Home() {
    const params = useSearchParams();
    const username = params.get("username") ?? "unknown";

    useEffect(() => {
        if (username) {
            connection.setup(username);
        }
    }, [username]);
    return (
        <View className="flex-1 justify-start items-center p-4">
            <Image source={BG} style={{ aspectRatio: 1, resizeMode: "contain" }} />
            <TouchableHighlight
                underlayColor="#234e52"
                className="bg-teal-400 w-full p-4 flex items-center font-semibold rounded-lg mb-4 aria-pressed:bg-teal-900"
                onPress={() => connection.createRoom()}
            >
                <Text>Create Room</Text>
            </TouchableHighlight>
            <TouchableHighlight
                className="bg-gray-400 w-full p-4 flex items-center font-semibold rounded-lg mb-4"
                underlayColor="#4b5563"
                onPress={() => {
                    connection.joinRoom("234");
                }}
            >
                <Text>Join Room</Text>
            </TouchableHighlight>
        </View>
    );
}
