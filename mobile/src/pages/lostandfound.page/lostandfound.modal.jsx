import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  ScrollView,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";
import {
  AntDesign,
  EvilIcons,
  MaterialIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  createHomePageData,
  deleteHomePageData,
  editHomePageData,
} from "../../utils/api/homedata-api";
import {
  createLostAndFoundData,
  editLostAndFoundData,
} from "../../utils/api/lostandfound-api";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: 10,
    height: "90%",
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
    borderWidth: 1,
  },
});

const LostAndFoundModal = ({
  setModalVisible = () => {},
  editMode = false,
  editData,
  setEditMode = () => {},
  getLostAndFoundDataVaiApi,
}) => {
  const { name = "", location = "", claimedBy = "", _id = "" } = editData;

  const [itemName, setItemName] = useState(editMode ? name : "");
  const [itemImageUpload, setItemImageUpload] = useState(null);
  const [itemLocation, setItemLocation] = useState(editMode ? location : "");
  const [itemClaimedBy, setClaimedBy] = useState(editMode ? claimedBy : "");

  useEffect(() => {});

  const handleItemImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        let localUri = result.uri;
        let fileName = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(fileName);
        let type = match ? `image/${match[1]}` : `image`;
        setItemImageUpload({ uri: localUri, name: fileName, type });
      }
    } catch (error) {}
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <EvilIcons
            name="close"
            size={30}
            color="#808080"
            style={{ position: "absolute", top: 10, right: 10, zIndex: 20 }}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <ScrollView style={{ width: "100%" }}>
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={{ marginVertical: 10 }}>
                {editMode
                  ? "Edit Lost And Found record"
                  : "Create Lost And Found record"}
              </Text>

              <TextInput
                mode="outlined"
                label="Item Name"
                value={itemName}
                onChangeText={setItemName}
                style={{ width: "95%" }}
              />
              {!editMode && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "95%",
                  }}
                >
                  <Pressable
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 100,
                      height: 80,
                      borderWidth: 1,
                      marginVertical: 20,
                    }}
                    onPress={handleItemImageUpload}
                  >
                    <Entypo name="upload" size={24} color="black" />
                  </Pressable>
                  <View
                    style={{
                      justifyContent: "space-evenly",
                      height: 80,
                      flex: 1,
                    }}
                  >
                    <Text style={{ color: "black", marginLeft: 10 }}>
                      Please note that image file should be less than 10MB and
                      jpg or png format.
                    </Text>
                    {!!itemImageUpload && (
                      <Text style={{ color: "green", marginLeft: 10 }}>
                        <Entypo name="check" size={10} color="green" /> Your
                        image has been added
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <TextInput
                mode="outlined"
                label="Found Location"
                value={itemLocation}
                onChangeText={setItemLocation}
                style={{ width: "95%", maxHeight: 200 }}
              />
              <TextInput
                mode="outlined"
                label="Claimed By"
                value={itemClaimedBy}
                onChangeText={setClaimedBy}
                style={{ width: "95%", maxHeight: 200 }}
              />

              <Pressable
                style={{
                  marginVertical: 20,
                  width: "95%",
                  height: 50,
                  borderWidth: 1,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (
                    !itemName ||
                    !itemLocation ||
                    (!editMode && !itemImageUpload)
                  ) {
                    return alert("Please enter necessary informations.");
                  }
                  if (editMode) {
                    editLostAndFoundData(_id, {
                      name: itemName,
                      location: itemLocation,
                      claimedBy: itemClaimedBy,
                    })
                      .then((result) => {
                        if (result) {
                          setModalVisible(false);
                          getLostAndFoundDataVaiApi();
                        } else {
                          alert("Something went wrong 1.");
                        }
                      })
                      .catch((error) => {
                        alert("Something went wrong 2.");
                      });
                  } else if (!editMode) {
                    const form = new FormData();
                    form.append("image", itemImageUpload);
                    form.append("name", itemName);
                    form.append("location", itemLocation);
                    form.append("claimedBy", itemClaimedBy);

                    createLostAndFoundData(form)
                      .then((result) => {
                        if (result) {
                          setModalVisible(false);
                          getLostAndFoundDataVaiApi();
                        } else {
                          alert("Something went wrong 3.");
                        }
                      })
                      .catch((error) => alert("Something went wrong 4."));
                  }
                }}
              >
                <Text>ADD</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LostAndFoundModal;
