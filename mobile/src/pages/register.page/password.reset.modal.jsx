import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput, Surface } from "react-native-paper";
import { RESPONSE, registerConstants } from "../../utils/index";

const PasswordResetModal = ({ modalVisible, setModalVisible, email }) => {
  const [loading, setLoading] = useState(false);
  const [codeSendMode, setCodeSendMode] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [password, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [resetCodeError, setResetCodeError] = useState(false);

  const {
    SMART_LOGIN: { label },
  } = registerConstants;

  const sendResetCodeToMail = async () => {
    const {
      API_URL: { PASSWORD_RESET_CODE },
    } = registerConstants;
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { status } = await axios.patch(
        PASSWORD_RESET_CODE,
        { email },
        config
      );
      if (status === RESPONSE.OK) {
        setCodeSendMode(false);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const setResetCodeValidation = (inpCode) => {
    setResetCodeError(!label.accessCode.codeRegex.test(inpCode));
    setAccessCode(inpCode);
  };

  const setPasswordByValidation = (inpPassword) => {
    setPasswordError(!label.password.passwordRegex.test(inpPassword));
    setNewPassword(inpPassword);
  };

  const verifyResetCodeAndCreateNewPassword = async () => {
    if (passwordError || resetCodeError) {
      return Alert.alert("", "Please enter required fields.");
    }
    const {
      API_URL: { PASSWORD_RESET },
    } = registerConstants;
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { status } = await axios.patch(
        PASSWORD_RESET,
        { email, accessCode, password },
        config
      );
      if (status === RESPONSE.OK) {
        Alert.alert("Congratulations!", "Your password is reset.", [
          {
            text: "View Login",
            onPress: () => {
              setLoading(false);
              setCodeSendMode(true);
              setAccessCode("");
              setNewPassword("");
              setPasswordError(false);
              setResetCodeError(false);
              setModalVisible(false);
            },
          },
        ]);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={0}
          onPress={() => {
            setLoading(false);
            setCodeSendMode(true);
            setAccessCode("");
            setNewPassword("");
            setPasswordError(false);
            setResetCodeError(false);
            setModalVisible(false);
          }}
        ></TouchableOpacity>
        <View style={styles.centeredView}>
          {codeSendMode ? (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                A reset code will be send to your email?
              </Text>
              <Button
                mode="contained"
                loading={loading}
                onPress={sendResetCodeToMail}
              >
                <Text style={styles.textStyle}>Send Reset Code</Text>
              </Button>
            </View>
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.normalText}>
                Enter your password reset code and a new password.
              </Text>
              <View style={{ height: 50, minWidth: "90%", marginBottom: 50 }}>
                <TextInput
                  label="5 digit activation Code"
                  mode="outlined"
                  placeholder="Enter 5 digit activation code"
                  value={accessCode}
                  onChangeText={setResetCodeValidation}
                  error={resetCodeError}
                />
              </View>
              <View style={{ height: 50, minWidth: "90%", marginBottom: 40 }}>
                <TextInput
                  label="New Password"
                  mode="outlined"
                  placeholder="Enter your new password"
                  value={password}
                  onChangeText={setPasswordByValidation}
                  error={passwordError}
                />
              </View>
              <Surface style={{ marginBottom: 15, padding: 10, elevation: 4 }}>
                {label.password.passwordCriteria.map((hint, index) => (
                  <Text key={index}>{hint}</Text>
                ))}
              </Surface>

              <Button
                mode="contained"
                loading={loading}
                onPress={verifyResetCodeAndCreateNewPassword}
              >
                <Text style={styles.textStyle}>Reset My Password</Text>
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
    width: "100%",
  },
});

export default PasswordResetModal;
