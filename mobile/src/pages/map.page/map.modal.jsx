import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, Pressable } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const MapModal = ({ setModalVisible, currentBuilding = null }) => {
  const [openDrawerIndex, setOpenDrawerIndex] = useState(-1);

  if (!currentBuilding) {
    return null;
  }
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <EvilIcons
              name="close"
              size={30}
              color="#808080"
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setModalVisible(false)}
            />
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              {currentBuilding.name}
            </Text>
            {currentBuilding.classes.length !== 0 ? (
              <ScrollView
                style={{
                  width: "100%",
                  flex: 1,
                }}
              >
                {currentBuilding.classes.map((each, index) => (
                  <View key={index}>
                    <Pressable
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderColor: "gray",
                      }}
                      onPress={() =>
                        setOpenDrawerIndex(
                          openDrawerIndex === index ? -1 : index
                        )
                      }
                    >
                      <Text style={{ fontSize: 20 }}>
                        {each.className}{" "}
                        {each.classCode ? "| " + each.classCode : ""}
                      </Text>
                      <AntDesign
                        name={openDrawerIndex === index ? "down" : "right"}
                        size={20}
                        color="black"
                      />
                    </Pressable>
                    {openDrawerIndex === index && (
                      <View
                        style={{
                          padding: 20,
                          borderBottomWidth: 1,
                          borderRightWidth: 1,
                          borderLeftWidth: 1,
                        }}
                      >
                        {each.direction.map((message, index) => (
                          <Text key={index}>{message}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    paddingHorizontal: 20,
                    fontSize: 25,
                    textAlign: "center",
                  }}
                >
                  {currentBuilding.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    position: "absolute",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "70%",
    width: "90%",
    position: "relative",
  },
});

export default MapModal;
