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
import { Paragraph, TextInput } from "react-native-paper";
import {
  AntDesign,
  EvilIcons,
  MaterialIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import {
  getImageById,
  deleteImageById,
  uploadImageViaApi,
} from "../../utils/api/image-api";
import * as ImagePicker from "expo-image-picker";
import {
  deleteHomePageData,
  editHomePageData,
} from "../../utils/api/homedata-api";

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

const ViewEditModal = ({
  setModalVisible = () => {},
  activeBuildingData = {
    _id: "",
    buildingName: "",
    images: [],
    description: "",
  },
  isAdmin = false,
  useHomePageApi,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageString, setImageString] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [buildingTitle, setBuildingTitle] = useState("");
  const [buildingDescription, setBuildingDescription] = useState("");
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    downloadImageHandler(imageIndex);
    setBuildingDescription(activeBuildingData.description);
    setBuildingTitle(activeBuildingData.buildingName);
    setEditMode(false);
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboard(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboard(false)
    );

    return () => {
      setImageIndex(0);
      setEditMode(false);
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [activeBuildingData]);

  const downloadImageHandler = async (index) => {
    try {
      if (activeBuildingData?.images?.length !== 0) {
        const result = await getImageById(activeBuildingData.images[index]);
        setImageString(result ? result : "");
      }
    } catch (error) {
      setImageString("");
    }
  };

  const handleNewImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        Alert.alert(
          "Are you sure you want to upload this image?",
          "Image must be less than 10MB and jpg/png format.",
          [
            {
              text: "Upload",
              onPress: async () => {
                let localUri = result.uri;
                let fileName = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                // Upload the image using the fetch and FormData APIs
                let formData = new FormData();
                // Assume "photo" is the name of the form field the server expects
                formData.append("image", {
                  uri: localUri,
                  name: fileName,
                  type,
                });
                try {
                  const result = await uploadImageViaApi(
                    "home",
                    activeBuildingData._id,
                    formData
                  );
                  if (result) {
                    useHomePageApi();
                  } else {
                    alert("Something went wrong. Please try again later");
                  }
                } catch (e) {
                  alert("Something went wrong.");
                }
              },
            },
            {
              text: "Cancel",
            },
          ]
        );
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
              setImageIndex(0);
              setModalVisible(false);
            }}
          />
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              {editMode ? (
                <TextInput
                  mode="outlined"
                  label="Building Name"
                  style={{ width: "95%", marginTop: 30, marginBottom: 10 }}
                  value={buildingTitle}
                  onChangeText={setBuildingTitle}
                />
              ) : (
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "black",
                    marginTop: 30,
                    marginBottom: 10,
                  }}
                >
                  {activeBuildingData.buildingName}
                </Text>
              )}
              <View
                style={{
                  width: 360,
                  height: 250,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <Image
                  source={
                    imageString
                      ? { uri: imageString }
                      : require("../../images/common/loading.png")
                  }
                  style={{ width: "100%", height: "100%", borderRadius: 20 }}
                />
                {isAdmin && !!imageString && (
                  <Pressable
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      borderRadius: 10,
                      backgroundColor: "white",
                      padding: 5,
                    }}
                    onPress={() =>
                      Alert.alert(
                        "",
                        "Are you sure you want to delete this image?",
                        [
                          {
                            text: "Delete",
                            onPress: () => {
                              if (
                                activeBuildingData._id &&
                                activeBuildingData.images[imageIndex]
                              ) {
                                deleteImageById(
                                  "home",
                                  activeBuildingData._id,
                                  activeBuildingData.images[imageIndex]
                                )
                                  .then((result) => {
                                    if (result) {
                                      if (
                                        activeBuildingData.images.length === 1
                                      ) {
                                        setImageString("");
                                      }
                                      useHomePageApi();
                                    } else {
                                      alert("Something went wrong.");
                                    }
                                  })
                                  .catch((error) =>
                                    alert("Something went wrong.")
                                  );
                              } else {
                                return alert("Something went wrong");
                              }
                            },
                          },
                          {
                            text: "Cancel",
                            onPress: () => {
                              return;
                            },
                          },
                        ]
                      )
                    }
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={24}
                      color="red"
                    />
                  </Pressable>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%",
                  marginVertical: 15,
                }}
              >
                <Pressable
                  style={{
                    width: 80,
                    alignItems: "center",
                  }}
                  disabled={
                    activeBuildingData.images.length === 0 || imageIndex === 0
                  }
                  onPress={() =>
                    setImageIndex((previous) => {
                      const newIndex = imageIndex === 0 ? 0 : imageIndex - 1;
                      if (newIndex !== previous) {
                        downloadImageHandler(newIndex);
                      }
                      return newIndex;
                    })
                  }
                >
                  <AntDesign name="caretleft" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={{
                    width: 80,
                    alignItems: "center",
                  }}
                  disabled={
                    activeBuildingData.images.length === 0 ||
                    imageIndex === activeBuildingData.images.length - 1
                  }
                  onPress={() => {
                    setImageIndex((previous) => {
                      const newIndex =
                        imageIndex === activeBuildingData.images.length - 1
                          ? activeBuildingData.images.length - 1
                          : imageIndex + 1;
                      if (newIndex !== previous) {
                        downloadImageHandler(newIndex);
                      }
                      return newIndex;
                    });
                  }}
                >
                  <AntDesign name="caretright" size={24} color="black" />
                </Pressable>
              </View>
              {editMode ? (
                <TextInput
                  mode="outlined"
                  label="Building Name"
                  style={{ width: "95%", marginVertical: 10, maxHeight: 180 }}
                  value={buildingDescription}
                  onChangeText={setBuildingDescription}
                  multiline={true}
                />
              ) : (
                <Paragraph
                  style={{ marginHorizontal: 20, textAlign: "justify" }}
                >
                  {activeBuildingData.description}
                </Paragraph>
              )}
            </View>
          </ScrollView>

          {isAdmin && (
            <View
              style={{
                width: "100%",
                height: 50,
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
                position: "absolute",
                bottom: 10,
              }}
            >
              {!editMode && (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  onPress={handleNewImageUpload}
                >
                  <Entypo name="folder-images" size={24} color="green" />
                </Pressable>
              )}
              {!editMode && (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  onPress={() => setEditMode(true)}
                >
                  <FontAwesome name="edit" size={24} color="gray" />
                </Pressable>
              )}

              {!editMode && (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  onPress={() => {
                    Alert.alert("Are you sure you want to delete this?", "", [
                      {
                        text: "Delete",
                        onPress: () => {
                          deleteHomePageData(activeBuildingData._id)
                            .then((result) => {
                              if (result) {
                                useHomePageApi();
                                setModalVisible(false);
                              } else {
                                alert("Something went wrong.");
                              }
                            })
                            .catch((error) => {
                              alert("Something went wrong");
                            });
                        },
                      },
                      {
                        text: "Cancel",
                      },
                    ]);
                  }}
                >
                  <MaterialIcons name="delete-outline" size={24} color="red" />
                </Pressable>
              )}

              {editMode && !keyboard && (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  onPress={() => {
                    if (
                      buildingDescription !== activeBuildingData.description ||
                      buildingTitle !== activeBuildingData.buildingName
                    ) {
                      editHomePageData(activeBuildingData._id, {
                        buildingName: buildingTitle,
                        description: buildingDescription,
                      })
                        .then((result) => {
                          if (result) {
                            useHomePageApi();
                          } else {
                            alert("Something went wrong.");
                          }
                        })
                        .catch((error) => {
                          alert("Something went wrong");
                        });
                    } else {
                      alert("Please make any text change.");
                    }
                  }}
                >
                  <FontAwesome name="check" size={24} color="green" />
                </Pressable>
              )}
              {editMode && !keyboard && (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                  }}
                  onPress={() => {
                    setEditMode(false);
                    setBuildingDescription(activeBuildingData.description);
                    setBuildingTitle(activeBuildingData.buildingName);
                  }}
                >
                  <Entypo name="cross" size={24} color="red" />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ViewEditModal;
