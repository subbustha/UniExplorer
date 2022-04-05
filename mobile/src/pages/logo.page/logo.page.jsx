import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, View, ImageBackground, Alert } from "react-native";
import CollegeLogo from "../../../assets/logo.page/logo.png";
import BackgroundLogo from "../../../assets/logo.page/background.jpg";
import { verifyIfUserIsLoggedIn } from "../../auth/authentication";
import NetInfo from "@react-native-community/netinfo";

export default function LogoPage({ navigation }) {
  const [imageViewDimension, setImageViewDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // NetInfo.fetch()
    //   .then((state) => {
    //     if (state.isConnected && state.isInternetReachable) {
          setTimeout(async () => {
            try {
              const isUserVerified = await verifyIfUserIsLoggedIn();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: isUserVerified ? "ActivityScreen" : "RegisterScreen",
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
      //   } else {
      //     throw Error("Internet not connected");
      //   }
      // })
      // .catch((error) => {
      //   Alert.alert("", "Please check your internet connection.");
      // });
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
