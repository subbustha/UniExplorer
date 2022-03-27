import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const FeedbackPage = () => {
  const [feedbackContent, setFeedbackContent] = useState("");

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        Your feedback is important to us!
      </Text>
      <Text style={{ fontWeight: "bold", fontSize: 14 }}>
        Please share you experience.
      </Text>
      <View style={{ width: "90%", marginTop: 50 }}>
        <TextInput
          onChangeText={(text) => setFeedbackContent(text)}
          style={{ maxHeight: 300 }}
          multiline
          mode="outlined"
          value={feedbackContent}
          label="Please enter your message here"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "90%",
          marginTop: 20,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#3498db",
            width: 80,
            alignItems: "center",
          }}
          onPress={() => {
            alert("Thank you for your feedback.");
            setFeedbackContent("");
          }}
        >
          <Text style={{ color: "white", padding: 10 }}>Submit</Text>
        </Pressable>
        <Pressable
          style={{ backgroundColor: "red", width: 80, alignItems: "center" }}
          onPress={() => setFeedbackContent("")}
        >
          <Text style={{ color: "white", padding: 10 }}>Erase</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FeedbackPage;
