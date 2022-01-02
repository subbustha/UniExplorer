import React from "react";
import MapPage from "./src/pages/map.page/map.page";
import RegisterPage from "./src/pages/register.page/register.page";
import HomePage from "./src/pages/home.page/home.page";
import LogoPage from "./src/pages/logo.page/logo.page";
import LostAndFoundPage from "./src/pages/lostandfound.page/lostandfound.page";
import { View } from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
    background: "#ffffff",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <HomePage />
      </View>
    </PaperProvider>
  );
}
