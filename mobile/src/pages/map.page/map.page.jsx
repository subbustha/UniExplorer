import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Overlay } from "react-native-maps";
import { TextInput } from "react-native-paper";
import * as Location from "expo-location";
import { BUILDING_DATA } from "./map.image.location";
import MapModal from "./map.modal";
import { EvilIcons } from "@expo/vector-icons";
import CollegeTile from "./mapmin.png";

const mapStyle = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

const staticLocation = {
  latitude: 27.7081557,
  longitude: 85.3254762,
  latitudeDelta: 0.0015,
  longitudeDelta: 0.0015,
};

const MapPage = () => {
  const [currentRegion, setCurrentRegion] = useState({ ...staticLocation });
  const [filteredBuildingInfo, setFilteredBuildingInfo] =
    useState(BUILDING_DATA);
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeoutStarted, setTimeouBoolean] = useState(false);
  const [buildingQuery, setBuildingQuery] = useState("");
  const locationSearchInput = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Please allow location access to use this feature.");
        return;
      }
      await Location.getCurrentPositionAsync({});
    })();
    return () => {
      triggerZoomLeave;
      restrictMapBoundaries;
    };
  }, []);

  const restrictMapBoundaries = (e) => {
    if (!timeoutStarted) {
      setTimeouBoolean(true);
      triggerZoomLeave();
    }
  };

  const triggerZoomLeave = () => {
    setTimeout(() => {
      setCurrentRegion({
        ...staticLocation,
      });
      setTimeouBoolean(false);
    }, 5000);
  };

  const triggerLocationFilter = (text) => {
    setBuildingQuery(text);
    setFilteredBuildingInfo(
      BUILDING_DATA.filter((each) =>
        each.tags.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <View style={styles.container}>
      <MapModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentBuilding={filteredBuildingInfo[currentBuildingIndex]}
      />
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          top: Platform.OS === "ios" ? 1 : 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <TextInput
            label="Search Map"
            mode="outlined"
            style={{ width: "90%" }}
            value={buildingQuery}
            onChangeText={triggerLocationFilter}
            ref={locationSearchInput}
          />
          {buildingQuery ? (
            <Pressable
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 25,
                zIndex: 10,
              }}
              onPress={() => {
                setFilteredBuildingInfo(BUILDING_DATA);
                setBuildingQuery("");
              }}
            >
              <EvilIcons name="close" size={24} color="#808080" />
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.container}>
        <MapView
          style={[styles.map, { marginTop: 60 }]}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={staticLocation}
          onRegionChangeComplete={restrictMapBoundaries}
          maxZoomLevel={20}
          minZoomLevel={18}
          mapType={Platform.OS == "android" ? "none" : "standard"}
        >
          {filteredBuildingInfo.map((each, index) => (
            <Marker
              coordinate={{
                latitude: each.coordinates[0],
                longitude: each.coordinates[1],
              }}
              key={index}
              onPress={() => {
                setCurrentBuildingIndex(index + 1);
                setModalVisible(true);
              }}
            />
          ))}
          <Overlay
            image={CollegeTile}
            bounds={[
              [27.7072057, 85.3246762],
              [27.7094557, 85.3263862],
            ]}
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapPage;
