import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { getHomePageData } from "../../utils/api/homedata-api";
import { getImageById } from "../../utils/api/image-api";
import { getLocalUserInfo } from "../../utils/api/constants";
import ViewEditModal from "./viewedit.modal";
import CreateModal from "./create.modal";

const CollegeCard = ({
  buildingInfo = { buildingName: "", images: [""], description: "" },
  setActiveBuilding,
  setModalVisible,
  setCreateModalVisible,
  index,
}) => {
  const [imageString, setImageString] = useState("");

  useEffect(() => {
    if (buildingInfo.images[0]) {
      getImageById(buildingInfo.images[0])
        .then((result) => setImageString(result))
        .catch((e) => setImageString(""));
    } else {
      setImageString("");
    }
  }, [buildingInfo]);

  return (
    <Card style={{ width: "100%", marginVertical: 10 }}>
      <Card.Cover
        source={
          imageString
            ? { uri: imageString }
            : require("../../images/common/loading.png")
        }
        style={{ resizeMode: "contain" }}
      />
      <Card.Actions style={{ flexDirection: "row" }}>
        <Title style={{ flex: 1 }}>{buildingInfo.buildingName}</Title>
        <Button
          onPress={() => {
            setModalVisible(true);
            setCreateModalVisible(false);
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

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [activeBuilding, setActiveBuilding] = useState(0);
  const [buildingData, setBuildingData] = useState(null);

  useEffect(() => {
    getLocalUserInfo()
      .then((data) => setIsAdmin(data ? data.isAdmin : false))
      .catch();
    useHomePageApi();
  }, []);

  const useHomePageApi = async () => {
    try {
      const result = await getHomePageData();
      setBuildingData(result ? result : []);
    } catch (e) {
      setBuildingData([]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {createModalVisible && !modalVisible && (
          <CreateModal
            setModalVisible={setCreateModalVisible}
            useHomePageApi={useHomePageApi}
          />
        )}
        {modalVisible && !createModalVisible && (
          <ViewEditModal
            setModalVisible={setModalVisible}
            activeBuildingData={buildingData[activeBuilding]}
            changeBuildingData={setBuildingData}
            useHomePageApi={useHomePageApi}
            isAdmin={isAdmin}
          />
        )}
        {isAdmin && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: "100%",
              height: 50,
              marginVertical: 10,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                borderWidth: 1,
              }}
              onPress={() => {
                setCreateModalVisible(true);
                setModalVisible(false);
              }}
            >
              <AntDesign name="addfile" size={24} color="black" />
            </Pressable>
            <Pressable
              style={{
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: "white",
              }}
              onPress={useHomePageApi}
            >
              <AntDesign name="reload1" size={24} color="black" />
            </Pressable>
          </View>
        )}
        {!!buildingData
          ? buildingData.map((data, index) => (
              <CollegeCard
                buildingInfo={data}
                key={index}
                index={index}
                setModalVisible={setModalVisible}
                setActiveBuilding={setActiveBuilding}
                setCreateModalVisible={setCreateModalVisible}
              />
            ))
          : null}
      </ScrollView>
    </View>
  );
};

export default HomePage;
