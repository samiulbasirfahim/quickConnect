import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";

type Props = {
    showModal: boolean;
    onClose: () => void;
    onChange: (text: string) => void;
};

export function JoinRoomModal({ showModal, onClose, onChange }: Props) {
    return (
        <Modal visible={showModal} animationType="fade" transparent>
            <View className="flex-1 bg-gray-800/30 justify-center items-center">
                <View className="bg-white w-[90%] p-10">
                    <View className="w-full">
                        <Text className="mb-2">Room ID</Text>
                        <TextInput
                            onChangeText={(text) => onChange(text)}
                            keyboardType="numeric"
                            maxLength={6}
                            onSubmitEditing={onClose}
                            className="w-full border-2 focus:border-teal-400 border-gray-400"
                        />
                    </View>
                    <View className="mt-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-teal-400 p-4 rounded-lg"
                        >
                            <Text style={{ color: "white", textAlign: "center" }}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
