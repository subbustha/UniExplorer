import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SMART_LOGIN } from "../register.page/regiser.constant";
import { EvilIcons } from "@expo/vector-icons";
import {
  sendAcitvationCodeToMail,
  verifyActivationCode,
} from "../../utils/api/user-api";

const AccontVerifyModal = ({ modalVisible, setModalVisible, email }) => {
  const [loading, setLoading] = useState(false);
  const [codeSendMode, setCodeSendMode] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [activateCodeError, setActivateCodeError] = useState(false);

  const { label } = SMART_LOGIN;
  const setActivationCodeValidation = (inpCode) => {
    setActivateCodeError(!label.accessCode.codeRegex.test(inpCode));
    setAccessCode(inpCode);
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          {codeSendMode ? (
            <View style={styles.modalView}>
              <EvilIcons
                name="close"
                size={30}
                color="#808080"
                style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
                onPress={() => {
                  setLoading(false);
                  setAccessCode("");
                  setActivateCodeError(false);
                  setModalVisible(false);
                }}
              />
              <Text style={styles.modalText}>
                Your account is not activated.
              </Text>
              <Button
                mode="contained"
                loading={loading}
                onPress={async () => {
                  setLoading(true);
                  try {
                    const result = await sendAcitvationCodeToMail(email);
                    if (result) {
                      setCodeSendMode(false);
                    } else {
                      alert("Something went wrong. Please try again later.");
                    }
                  } catch (error) {}

                  setLoading(false);
                }}
              >
                <Text style={styles.textStyle}>Verify Email Address</Text>
              </Button>
            </View>
          ) : (
            <View style={styles.modalView}>
              <EvilIcons
                name="close"
                size={30}
                color="#808080"
                style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
                onPress={() => {
                  setLoading(false);
                  setAccessCode("");
                  setActivateCodeError(false);
                  setModalVisible(false);
                }}
              />
              <Text style={styles.normalText}>
                Activation code sent to your email.
              </Text>
              <View style={{ height: 50, minWidth: "90%", marginBottom: 50 }}>
                <TextInput
                  style={styles.activationInput}
                  label="5 digit activation Code"
                  autoFocus
                  mode="outlined"
                  placeholder="Enter 5 digit activation code"
                  value={accessCode}
                  onChangeText={setActivationCodeValidation}
                  error={activateCodeError}
                />
              </View>

              <Button
                mode="contained"
                loading={loading}
                onPress={async () => {
                  if (activateCodeError) {
                    return Alert.alert("", "Please enter required fields.");
                  }
                  setLoading(true);
                  try {
                    const verification = await verifyActivationCode({
                      email,
                      accessCode,
                    });
                    if (verification) {
                      Alert.alert(
                        "Congratulations!",
                        "Your account has been activated.",
                        [
                          {
                            text: "Go Back To Login",
                            onPress: () => setModalVisible(false),
                          },
                        ]
                      );
                    } else {
                      alert("Something went wrong. Please try again later.");
                    }
                  } catch (error) {
                    alert("Something went wrong. Please try again later.");
                  }
                  setLoading(false);
                }}
              >
                <Text style={styles.textStyle}>Activate My Account</Text>
              </Button>
              <Button
                style={{ marginTop: 10 }}
                onPress={() => setCodeSendMode(true)}
              >
                <Text style={{ fontSize: 10, color: "black" }}>
                  Did not receive code ?
                </Text>
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  modalView: {
    backgroundColor: "white",
    maxWidth: "95%",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    position: "relative",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    color: "white",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "red",
  },
  normalText: {
    textAlign: "center",
    color: "black",
    marginBottom: 15,
  },
  emailText: {
    textAlign: "center",
    color: "black",
    marginBottom: 15,
  },
  activationInput: {
    height: 50,
  },
});

export default AccontVerifyModal;
