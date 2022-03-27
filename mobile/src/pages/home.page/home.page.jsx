import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import BuldingData from "./buildings.info.json";
import { AntDesign } from "@expo/vector-icons";

const CollegeCard = ({
  collegeName = "",
  collegeImageUrl = "",
  setActiveBuilding,
  setModalVisible,
  index,
}) => {
  return (
    <Card style={{ width: "100%", marginVertical: 10 }}>
      <Card.Cover
        source={{
          uri: collegeImageUrl[0],
        }}
      />
      <Card.Actions style={{ flexDirection: "row" }}>
        <Title style={{ flex: 1 }}>{collegeName}</Title>
        <Button
          onPress={() => {
            setModalVisible(true);
            setActiveBuilding(index);
          }}
        >
          Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "95%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    marginHorizontal: 10,
    height: "100%",
    width: "99%",
    backgroundColor: "#C5C5C5",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
  },
  button: {
    elevation: 2,
    width: 50,
    height: 50,
    marginVertical: 10,
    borderRadius: 100,
    justifyContent: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

const EachModal = ({
  modalVisible = false,
  setModalVisible,
  imageList = [],
  description = "",
  name=""
}) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [imageList]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <Text style={{fontWeight:"bold",fontSize:25, color:"black"}}>{name}</Text>
          <Image
            source={{
              uri: imageList[imageIndex],
            }}
            style={{
              width: 380,
              height: 250,
              margin: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
              marginVertical: 15,
            }}
          >
            <Pressable
              style={{
                width: 80,
                alignItems: "center",
              }}
              onPress={() =>
                setImageIndex(
                  imageIndex === 0 ? imageList.length - 1 : imageIndex - 1
                )
              }
            >
              <AntDesign name="caretleft" size={24} color="black" />
            </Pressable>
            <Pressable
              style={{
                width: 80,
                alignItems: "center",
              }}
              onPress={() =>
                setImageIndex(
                  imageIndex === imageList.length - 1 ? 0 : imageIndex + 1
                )
              }
            >
              <AntDesign name="caretright" size={24} color="black" />
            </Pressable>
          </View>
          <Paragraph style={{ marginHorizontal: 20, textAlign: "justify" }}>
            {description}
          </Paragraph>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>X</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <EachModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          imageList={BuldingData[activeBuilding].images}
          description={BuldingData[activeBuilding].description}
          name={BuldingData[activeBuilding].name}
        />
        {BuldingData.map((data, index) => (
          <CollegeCard
            collegeName={data.name}
            collegeImageUrl={data.images}
            key={index}
            index={index}
            setModalVisible={setModalVisible}
            setActiveBuilding={setActiveBuilding}
          />
        ))}
      </ScrollView>
    </View>
  );
}
