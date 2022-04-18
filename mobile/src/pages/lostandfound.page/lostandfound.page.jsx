import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, View, Text, Keyboard } from "react-native";
import { TextInput, DefaultTheme } from "react-native-paper";
import CardComponent from "../../components/card.component/card.component";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { AntDesign } from "@expo/vector-icons";
import { getLostAndFoundData } from "../../utils/api/lostandfound-api";
import { getLocalUserInfo } from "../../utils/api/constants";
import LostAndFoundModal from "./lostandfound.modal";

const LostAndFoundPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [completeData, setCompleteData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    location: "",
    claimedBy: "",
    _id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboard(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboard(false)
    );
    getLocalUserInfo()
      .then((data) => setIsAdmin(data ? data.isAdmin : false))
      .catch();
    getLostAndFoundDataVaiApi();
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getLostAndFoundDataVaiApi = () => {
    getLostAndFoundData()
      .then((result) => {
        if (result) {
          setCompleteData(result);
          setSearchData(result);
        } else if (result?.length === 0) {
          setCompleteData([]);
          setSearchData([]);
        } else {
          alert("Something went wrong 1.");
        }
      })
      .catch(() => alert("Something went wrong 2."));
  };

  const searchDataCollection = (text) => {
    setCurrentInput(text);
    setSearchData(
      completeData.filter(
        (each) =>
          each.name.toLowerCase().includes(text.toLowerCase()) ||
          each.location.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const renderItem = ({ item }) => (
    <CardComponent
      {...item}
      setEditMode={setEditMode}
      setEditData={setEditData}
      setShowModal={setShowModal}
      getLostAndFoundDataVaiApi={getLostAndFoundDataVaiApi}
      isAdmin={isAdmin}
    />
  );
  return (
    <View style={{ minHeight: "100%", display: "flex", alignItems: "center" }}>
      {showModal && isAdmin && (
        <LostAndFoundModal
          setModalVisible={setShowModal}
          editData={editData}
          editMode={editMode}
          getLostAndFoundDataVaiApi={getLostAndFoundDataVaiApi}
        />
      )}
      <View
        style={{ width: "95%", flexDirection: "row", alignItems: "center" }}
      >
        <TextInput
          label="Search Lost and Found"
          value={currentInput}
          onChangeText={(text) => searchDataCollection(text)}
          mode="outlined"
          style={{ flex: 1 }}
        />
        {!keyboard && (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={{
                width: 50,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setCurrentInput("");
                getLostAndFoundDataVaiApi();
              }}
            >
              <AntDesign name="reload1" size={24} color="black" />
            </Pressable>
            {isAdmin && (
              <Pressable
                style={{
                  width: 50,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setEditMode(null);
                  setShowModal(true);
                }}
              >
                <AntDesign name="pluscircleo" size={24} color="black" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <SafeAreaView style={{ flex: 1, width: "95%" }}>
        <FlatList
          data={searchData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index + ""}
          style={{ marginBottom: 70 }}
        />
      </SafeAreaView>
    </View>
  );
};

export default LostAndFoundPage;
