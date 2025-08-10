import { connection } from "@/lib/connection";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
    useEffect(() => {
        connection.setup("React Native");
    }, []);
    return (
        <View className="flex-1 justify-center items-center">
            <Pressable onPress={() => connection.createRoom()}>
                <Text>Create Room</Text>
            </Pressable>
            <Link href={"/room"}>Join Room</Link>
        </View>
    );
}
