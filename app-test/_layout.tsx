import "./global.css";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
    return (
        <SafeAreaView className="flex-1">
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </SafeAreaView>
    );
}
