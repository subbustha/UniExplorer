import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TextInput } from "react-native-paper";
import * as Location from "expo-location";
import { BUILDING_DATA } from "./map.image.location";
import MapModal from "./map.modal";
import { Entypo } from "@expo/vector-icons";

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
  latitude: 27.7081957,
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
       each.tags.toLowerCase().includes(text.toLowerCase()))
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
        <TextInput
          label="Search Building Location"
          mode="outlined"
          style={{ width: "85%" }}
          value={buildingQuery}
          onChangeText={triggerLocationFilter}
          ref={locationSearchInput}
        />
        <Pressable
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setFilteredBuildingInfo(BUILDING_DATA);
            setBuildingQuery("");
            locationSearchInput.current.blur();
          }}
        >
          <Entypo name="circle-with-cross" size={50} color="black" />
        </Pressable>
      </View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={currentRegion}
          onRegionChangeComplete={restrictMapBoundaries}
          maxZoomLevel={20}
          minZoomLevel={18}
        >
          {filteredBuildingInfo.map((each, index) => (
            <Marker
              coordinate={{
                latitude: each.coordinates[0],
                longitude: each.coordinates[1],
              }}
              key={index}
              onPress={() => {
                setCurrentBuildingIndex(index);
                setModalVisible(true);
              }}
            />
          ))}
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
