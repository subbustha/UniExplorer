import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { TextInput, DefaultTheme} from "react-native-paper";
import CardComponent from "../../components/card.component/card.component";

import data from "./sample.data";

const LostAndFoundPage = () => {
  const [searchData, setSearchData] = useState(data);
  
  useEffect(() => {
    //TO DO: Api call to search lost and found data
  },[]);
  
  const searchDataCollection = (text) => {
    setSearchData(data.filter((each) => each.name.includes(text)));
  };
  const renderItem = ({ item }) => <CardComponent {...item} />;
  return (
    <View>
      <View style={{ width: 400 }}>
        <TextInput
          label="Search Lost and Found"
          onChangeText={(text) => searchDataCollection(text)}
          mode="outlined"
          outlineColor={DefaultTheme.colors.primary}
        />
      </View>

      <SafeAreaView style={{flex:1}}>
        <FlatList
          data={searchData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default LostAndFoundPage;
