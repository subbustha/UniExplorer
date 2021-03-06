import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, View, ImageBackground, Text } from "react-native";
import { Button } from "react-native-paper";
import CollegeLogo from "../../../assets/logo.page/logo.png";
import BackgroundLogo from "../../../assets/logo.page/background.jpg";
import { auth } from "../../auth/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SMART_LOGIN } from "../../utils/constants/regiser.constant";

export default function LogoPage({ navigation }) {
  const [imageViewDimension, setImageViewDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setTimeout(async () => {
      try {
        const persistentLogin = await AsyncStorage.getItem(
          SMART_LOGIN.label.PERSISTENT_LOGIN_KEY
        );
        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                !!auth.currentUser && JSON.parse(persistentLogin)
                  ? "ActivityScreen"
                  : "RegisterScreen",
            },
          ],
        });
      } catch (e) {
        navigation.reset({
          index: 0,
          routes: [{ name: "RegisterScreen" }],
        });
      }
    }, 3000);
  }, []);

  return (
    <ImageBackground source={BackgroundLogo} style={styles.mainContainer}>
      <View
        key="logo-container"
        style={styles.logoContainer}
        onLayout={(event) => {
          // eslint-disable-next-line no-unused-vars
          var { x, y, width, height } = event.nativeEvent.layout;
          setImageViewDimension({
            width: parseInt(width),
            height: parseInt(height),
          });
        }}
      ></View>
      <StatusBar hidden />
      <Image
        source={CollegeLogo}
        style={{
          width: imageViewDimension.width * 0.7,
          height: imageViewDimension.width * 0.7,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    backgroundColor: "grey",
    opacity: 0.9,
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 0,
  },
});
