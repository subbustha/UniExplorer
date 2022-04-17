import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import { getImageById } from "../../utils/api/image-api";

const CardComponent = (props) => {
  const {
    name = "Not provided",
    image = "",
    location = "Not provided",
    claimedBy = "",
  } = props;

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
          backgroundColor: "#bfbfbf",
          justifyContent: "space-evenly",
        }}
      >
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
