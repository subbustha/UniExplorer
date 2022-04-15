import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, View, ImageBackground, Alert } from "react-native";
import BackgroundLogo from "../../images/logo.page/background.png";
import { verifyIfUserIsLoggedIn } from "../../utils/api/authentication";
// import NetInfo from "@react-native-community/netinfo";

export default function LogoPage({ navigation }) {
  useEffect(() => {
    // NetInfo.fetch()
    //   .then((state) => {
    //     if (state.isConnected && state.isInternetReachable) {
    setTimeout(async () => {
      try {
        const isUserVerified = await verifyIfUserIsLoggedIn();
        console.log("isUserVerified = " + isUserVerified);
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
      <StatusBar hidden />
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
});
