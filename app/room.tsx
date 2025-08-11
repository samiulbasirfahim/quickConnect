import { NavigationAction } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import {
  Clipboard,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Room() {
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<NavigationAction | null>(null);

  const params = useSearchParams();
  const roomID = params.get("roomID");

  const navigation = useNavigation();

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      setPendingNavigation(e.data.action);

      setShowModal(true);
    });
    return unsub;
  }, [navigation]);

  return (
    <SafeAreaView>
      <View>
        <Pressable>
          <Text>{roomID}</Text>
        </Pressable>

        <Modal visible={showModal} animationType="fade" transparent>
          <View className="flex-1 bg-gray-800/30 justify-center items-center">
            <View className="bg-white w-[90%] p-10">
              <Text className="text-red-500 mb-4 text-center">
                You&apos;ll be disconnected from the room.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(String(roomID));
                }}
                className="p-4 bg-gray-400 rounded-lg"
              >
                <Text className="text-xl font-semibold text-center">
                  {roomID}
                </Text>
              </TouchableOpacity>
              <View className="mt-4">
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    if (pendingNavigation) {
                      navigation.dispatch(pendingNavigation);
                    }
                  }}
                  className="bg-red-500 p-4 rounded-lg"
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Leave Room
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPendingNavigation(null);
                    setShowModal(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  <Text className="text-center text-blue-400">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
