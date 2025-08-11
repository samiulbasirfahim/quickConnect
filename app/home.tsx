import { connection } from "../lib/connection";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  Image,
  TouchableHighlight,
  Modal,
} from "react-native";
import BG from "../assets/images/home-bg.png";
import { JoinRoomModal } from "../components/join-room-modal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [roomID, setRoomID] = useState("");
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
          setShowModal(true);
          setRoomID("");
        }}
      >
        <Text>Join Room</Text>
      </TouchableHighlight>
      <JoinRoomModal
        showModal={showModal}
        onChange={(text: string) => {
          setRoomID(text);
        }}
        onClose={() => {
          setShowModal(false);
          if (roomID.trim().length === 6) connection.joinRoom(roomID);
        }}
      />
    </View>
  );
}
