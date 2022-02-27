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

const mapStyle = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

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
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: 27.7087957,
          longitude: 85.3258762,
          latitudeDelta: 0.02,
          longitudeDelta: 0.002,
        }}
        maxZoomLevel={20}
        minZoomLevel={18}
      >
        {/* <Marker
          coordinate={{
            latitude: 27.7075,
            longitude: 85.3256020,
          }}
          description={"This is a marker in React Natve"}
          icon={CollegeMap}
        >
        </Marker> */}
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
