import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteUserAccount } from "../../utils/api/user-api";

const AdminCard = ({ adminEmail = "", adminName = "", getAllAdminsViaApi }) => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        marginVertical: 10,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <View stlye={{ flex: 1 }}>
        <Text>Admin: {adminName}</Text>
        <Text>{adminEmail}</Text>
      </View>
      <Pressable
        onPress={() =>
          Alert.alert("Delete this admin?", "", [
            {
              text: "Delete",
              onPress: () => {
                deleteUserAccount(adminEmail)
                  .then((result) => {
                    if (result) {
                      getAllAdminsViaApi();
                    } else {
                      alert("You are not permitted for this action.");
                    }
                  })
                  .catch((e) => alert("Something went wrong."));
              },
            },
            {
              text: "Cancel",
            },
          ])
        }
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </Pressable>
    </View>
  );
};

export default AdminCard;
