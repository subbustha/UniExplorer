import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Caption, Paragraph } from "react-native-paper";

const CardComponent = (props) => {
  const {
    name = "Not provided",
    image = null,
    location = "Not provided",
    color = null,
    claimed = false,
    by = "None",
  } = props;

  const ColorView = () => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
    >
      <Paragraph>Color:</Paragraph>
      <MaterialCommunityIcons
        name={color ? "rectangle" : "file-question-outline"}
        size={24}
        color={color ? color : "#000000"}
      />
    </View>
  );

  return (
    <Card
      style={{ width: 400, elevation: 3, borderWidth: 2, marginTop: 10 }}
    >
      <Card.Title
        title={name}
        right={ColorView}
        subtitle={`Found at: ${location}`}
      />
      <Card.Cover source={{ uri: image }} />
      <Paragraph style={{ margin: 10 }}>
        Claimed by: {claimed ? by : "None"}
      </Paragraph>
    </Card>
  );
};

export default CardComponent;
