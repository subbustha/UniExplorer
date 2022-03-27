import React from "react";
import { View, Image, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Paragraph } from "react-native-paper";

const CardComponent = (props) => {
  const {
    name = "Not provided",
    image = "",
    location = "Not provided",
    color = null,
    claimedBy = "",
  } = props;

  return (
    <View
      style={{
        flexDirection: "row",
        width: 400,
        height: 150,
        marginTop: 10,
        elevation:2
      }}
    >
      <Image
        source={{ uri: `data:image/png;base64,${image}` }}
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

        <Text style={{ marginLeft: 10, fontSize:11 }}>
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
