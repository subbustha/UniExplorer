import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import CollegeMap from "../../../assets/maps.page/mapmin.png";

const MapPage = () => {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Please allow location access to use this feature.");
        return;
      }
      await Location.getCurrentPositionAsync({});
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        // showsMyLocationButton={true}
        zoomEnabled={true}
        region={{
          latitude: 27.7090957,
          longitude: 85.3260762,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          coordinate={{
            latitude: 27.707520,
            longitude: 85.3256167,
          }}
          description={"This is a marker in React Natve"}
          icon={CollegeMap}
        >
          {/* <Image
            source={CollegeMap}
            style={{ flex:1,width:"100%" }}
          /> */}
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapPage;
