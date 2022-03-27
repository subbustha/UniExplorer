import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, View, Text } from "react-native";
import { TextInput, DefaultTheme } from "react-native-paper";
import CardComponent from "../../components/card.component/card.component";
import { API_URL } from "../../utils/constants/regiser.constant";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { AntDesign } from "@expo/vector-icons";

const LostAndFoundPage = () => {
  const [currentInput, setCurrentInput] = useState("");
  const [completeData, setCompleteData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    getItemsData();
  }, []);

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

  const getItemsData = () => {
    axios
      .get(API_URL.GET_LAS_ITEM)
      .then((response) => {
        setCompleteData(response.data);
        setSearchData(response.data);
      })
      .catch();
  };

  const renderItem = ({ item }) => <CardComponent {...item} />;
  return (
    <View style={{ minHeight: "100%", display: "flex", alignItems: "center" }}>
      <View
        style={{ width: "95%", flexDirection: "row", alignItems: "center" }}
      >
        <TextInput
          label="Search Lost and Found"
          value={currentInput}
          onChangeText={(text) => searchDataCollection(text)}
          mode="outlined"
          outlineColor={DefaultTheme.colors.primary}
          style={{ flex: 1 }}
        />
        <Pressable
          style={{
            width: 50,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setCurrentInput("");
            getItemsData();
          }}
        >
          <AntDesign name="reload1" size={24} color="black" />
        </Pressable>
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
