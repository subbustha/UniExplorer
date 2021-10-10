import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";

const MapPage = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        region={{
          latitude: 27.708748913245735,
          longitude: 85.32617725875393,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapPage;
