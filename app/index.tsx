import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

export default function Index() {
  const [username, setUsername] = useState("");

  function handleStart() {
    if (!(username.trim().length > 0)) return;
    router.push({
      pathname: "/home",
      params: {
        username,
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View className="justify-center items-center flex-1 p-4 gap-4">
        <View className="w-full">
          <Text className="mb-2">Username</Text>
          <TextInput
            onChangeText={(text) => setUsername(text)}
            onSubmitEditing={handleStart}
            className="w-full border-2 focus:border-teal-400 border-gray-400"
          />
        </View>
        <TouchableHighlight
          disabled={username.trim().length < 1}
          className="px-6 py-2 rounded-lg disabled:bg-gray-400 bg-teal-400"
          onPress={handleStart}
        >
          <Text>Start</Text>
        </TouchableHighlight>
      </View>
    </KeyboardAvoidingView>
  );
}
