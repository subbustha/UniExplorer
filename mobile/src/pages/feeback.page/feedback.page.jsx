import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { sendFeedback, getFeedback } from "../../utils/api/feedback-api";
import { getLocalUserInfo } from "../../utils/api/constants";

const FeedbackPage = () => {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    getLocalUserInfo()
      .then((user) => {
        setIsAdmin(user ? user.isAdmin : false);
        if (user?.isAdmin) {
          getFeedbackDataFromApi();
        }
      })
      .catch();
  }, []);

  const getFeedbackDataFromApi = () => {
    getFeedback()
      .then((data) => {
        if (data) {
          setFeedbackData(data);
        }
      })
      .catch();
  };

  const sendFeedbackButtonHandler = async () => {
    if (feedbackContent) {
      try {
        const result = await sendFeedback(feedbackContent);
        if (result === true) {
          alert("Thank you for your feedback");
        } else {
          alert(
            "Could not submit feedback. Please check your internet connection."
          );
        }
      } catch (error) {
        alert(
          "Could not submit feedback. Please check your internet connection."
        );
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isAdmin && (
        <>
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
              onPress={sendFeedbackButtonHandler}
            >
              <Text style={{ color: "white", padding: 10 }}>Submit</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "red",
                width: 80,
                alignItems: "center",
              }}
              onPress={() => setFeedbackContent("")}
            >
              <Text style={{ color: "white", padding: 10 }}>Erase</Text>
            </Pressable>
          </View>
        </>
      )}
      {isAdmin && (
        <View
          style={{
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <ScrollView style={{ width: "95%" }}>
            {!feedbackData && (
              <Text style={{ marginTop: 50 }}>
                No feedback data to display.
              </Text>
            )}
            {feedbackData &&
              feedbackData.reverse().map((each, index) => (
                <View
                  key={index}
                  style={{
                    margin: 10,
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Text>{each.message}</Text>
                </View>
              ))}
          </ScrollView>
          <Pressable
            style={{
              width: "90%",
              backgroundColor: "blue",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              borderRadius: 10,
            }}
            onPress={getFeedbackDataFromApi}
          >
            <Text style={{ color: "white" }}>Refresh</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default FeedbackPage;
