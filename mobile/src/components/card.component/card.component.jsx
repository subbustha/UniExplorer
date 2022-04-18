import React, { useEffect, useState } from "react";
import { View, Image, Text, Pressable, Alert } from "react-native";
import { getImageById } from "../../utils/api/image-api";
import { AntDesign, Feather } from "@expo/vector-icons";
import { deleteLostAndFoundData } from "../../utils/api/lostandfound-api";

const CardComponent = ({
  name = "Not provided",
  image = "",
  location = "Not provided",
  claimedBy = "",
  _id = "",
  setEditMode,
  setEditData,
  setShowModal,
  getLostAndFoundDataVaiApi,
  isAdmin = false,
}) => {
  const [imageValue, setImageValue] = useState("");

  useEffect(() => {
    if (image) {
      getImageById(image)
        .then((result) => setImageValue(result))
        .catch(() => {});
    }
  }, [image]);

  return (
    <View
      style={{
        flexDirection: "row",
        width: 400,
        height: 150,
        marginTop: 10,
        elevation: 2,
      }}
    >
      <Image
        source={
          imageValue
            ? { uri: imageValue }
            : require("../../images/common/loading.png")
        }
        style={{ width: 150, height: 150, backgroundColor: "black" }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "space-evenly",
          position: "relative",
        }}
      >
        {isAdmin && (
          <View
            style={{
              position: "absolute",
              bottom: 5,
              right: 50,
              width: 80,
              height: 25,
              flexDirection: "row",
              justifyContent: "space-between",
              zIndex: 5,
            }}
          >
            <Pressable
              onPress={() => {
                setEditData({ name, location, claimedBy, _id });
                setShowModal(true);
                setEditMode(true);
              }}
            >
              <AntDesign name="edit" size={24} color="gray" />
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert("Are you sure you want to delete this item?", "", [
                  {
                    text: "Delete",
                    onPress: () => {
                      deleteLostAndFoundData(_id)
                        .then((result) => {
                          if (result) {
                            getLostAndFoundDataVaiApi();
                          } else {
                            alert("Something went wrong.");
                          }
                        })
                        .catch((error) => alert("Something went wrong."));
                    },
                  },
                  {
                    text: "Cancel",
                  },
                ]);
              }}
            >
              <Feather name="trash" size={20} color="red" />
            </Pressable>
          </View>
        )}
        <View>
          <Text
            style={{
              marginLeft: 10,
              color: "black",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 0,
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            Found at: {location}
          </Text>
        </View>

        <Text style={{ marginLeft: 10, fontSize: 11 }}>
          Claimed: {claimedBy ? claimedBy : "None"}
        </Text>
      </View>
    </View>
  );

  // return (
  //   <Card style={{ width: 400, elevation: 3, borderWidth: 2, marginTop: 10 }}>
  //     <Card.Title
  //       title={name}
  //       right={ColorView}
  //       subtitle={`Found at: ${location}`}
  //     />
  //     <Paragraph style={{ marginLeft: 15, marginTop: 0, fontSize:11 }}>
  //       Claimed by: {claimedBy ? claimedBy : "None"}
  //     </Paragraph>
  //     <Card.Cover source={{ uri: `data:image/png;base64,${image}` }} />
  //   </Card>
  // );
};

export default CardComponent;
