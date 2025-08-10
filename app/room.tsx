import { useSearchParams } from "expo-router/build/hooks";
import { Text, View } from "react-native";

export default function Room() {
    const params = useSearchParams();
    const roomID = params.get("roomID");
    return (
        <View>
            <Text>{roomID}</Text>
        </View>
    );
}
