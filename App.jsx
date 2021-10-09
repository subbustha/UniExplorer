import React from "react";
import LostAndFoundPage from "./src/pages/lostandfound.page/lostandfound.page";
import { View } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
    background:"#ffffff"
  },
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={{height:"8%"}}/>
      <View style={{flex:1, alignItems:"center"}}>
        <LostAndFoundPage />
      </View>
      
      <View style={{height:"7%"}}/>
    </PaperProvider>
  );
}
