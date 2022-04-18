import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const MapModal = ({
  modalVisible,
  setModalVisible,
  currentBuilding = null,
}) => {
  if (!currentBuilding) {
    return null;
  }
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
            <ScrollView
              style={{
                width: "100%",
                flex: 1,
              }}
            >
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
              <View
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
              >
                <Text style={{ fontSize: 20 }}>LP-0126</Text>
                <AntDesign name="right" size={15} color="black" />
              </View>
            </ScrollView>
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
