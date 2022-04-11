import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import StaticBuildingData from "./buildings.info.json";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import axios from "axios";

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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: 10,
    height: "90%",
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
    backgroundColor: "#d9d9d9",
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
  name = "",
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
          <EvilIcons
            name="close"
            size={30}
            color="#808080"
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={() => {
              setImageIndex(0);
              setModalVisible(false);
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              color: "black",
              marginVertical: 10,
            }}
          >
            {name}
          </Text>
          <Image
            source={{
              uri: imageList[imageIndex],
            }}
            style={{
              width: 360,
              height: 250,
              margin: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "black",
            }}
          />
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
        </View>
      </View>
    </Modal>
  );
};

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [BuildingData, setBuildingData] = useState(StaticBuildingData);

  useEffect(() => {
    axios
      .get(
        "https://drive.google.com/uc?export=view&id=1uv17_XyFPBmBbfc5yWUGPFoIjDdRE1EO"
      )
      .then((response) => {
        if (response.data && response.data.length !== 0) {
          setBuildingData(response.data);
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <EachModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          imageList={BuildingData[activeBuilding].images}
          description={BuildingData[activeBuilding].description}
          name={BuildingData[activeBuilding].name}
        />
        {BuildingData.map((data, index) => (
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
