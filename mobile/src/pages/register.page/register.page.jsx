import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Keyboard,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Headline,
  Subheading,
  TextInput,
  Button,
  Paragraph,
  Surface,
  Text,
} from "react-native-paper";
import { registerConstants, validators, RESPONSE } from "../../utils/index";
import { DefaultTheme } from "react-native-paper";
import CollegeLogo from "../../../assets/logo.page/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AccontVerifyModal from "./account.verify.modal";
import PasswordResetModal from "./password.reset.modal";

const {
  VIEWS,
  SMART_LOGIN: { header, subHeader, label, button },
  API_URL,
} = registerConstants;
const { emailValidator, passwordValidator, fullNameValidator } = validators;

const RegisterPage = (props) => {
  const [modalAccountActivateVisible, setModalAccountActivateVisible] =
    useState(false);
  const [modalPasswordResetVisible, setModalPasswordResetVisible] =
    useState(false);
  const [currentView, setCurrentView] = useState(VIEWS.LOOKUP_VIEW);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({
    visible: false,
    message: label.email.name,
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    visible: false,
    message: label.password.name,
  });
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState({
    visible: false,
    message: label.fullName.name,
  });

  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboard(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboard(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const changeStateAndValidateInput = (input, isName = false) => {
    if (currentView === VIEWS.LOOKUP_VIEW) {
      setEmail(input.trim());
      setEmailError(emailValidator(input.trim(), emailError));
    } else if (currentView === VIEWS.CREATE_VIEW) {
      if (isName) {
        setFullName(input);
        setFullNameError(fullNameValidator(input, fullNameError));
      } else {
        setPassword(input);
        setPasswordError(passwordValidator(input, passwordError));
      }
    } else if (currentView === VIEWS.LOGIN_VIEW) {
      setPassword(input);
    }
  };

  const editEmail = () => {
    setCurrentView(VIEWS.LOOKUP_VIEW);
  };

  const handleAccountRegister = () => {
    switch (currentView) {
      case VIEWS.LOOKUP_VIEW:
        lookupUserAccount();
        break;
      case VIEWS.CREATE_VIEW:
        createUserAccount();
        break;
      case VIEWS.LOGIN_VIEW:
        loginUserAccount();
        break;
    }
  };

  const lookupUserAccount = async () => {
    if (emailError.message !== label.email.name) {
      return setEmailError({ ...emailError, visible: true });
    }
    if (!email) {
      return setEmailError({ visible: true, message: label.email.required });
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      };
      const { status } = await axios.get(API_URL.LOOKUP + "/" + email, config);
      if (status === RESPONSE.OK) {
        setCurrentView(VIEWS.LOGIN_VIEW);
      } else if (status === RESPONSE.NOT_FOUND) {
        setCurrentView(VIEWS.CREATE_VIEW);
      } else if (status === RESPONSE.CONFLICT) {
        setModalAccountActivateVisible(true);
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const createUserAccount = async () => {
    if (!fullName) {
      return setFullNameError({
        visible: true,
        message: label.fullName.required,
      });
    } else if (fullNameError.message !== label.fullName.name) {
      return setFullNameError({ ...fullNameError, visible: true });
    } else if (!password) {
      return setPasswordError({
        visible: true,
        message: label.password.required,
      });
    } else if (passwordError.message !== label.password.name) {
      return setPasswordError({ ...passwordError, visible: true });
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { status } = await axios.post(
        API_URL.CREATE,
        { email, password, fullName },
        config
      );
      if (status === RESPONSE.CREATED) {
        setCurrentView(VIEWS.LOGIN_VIEW);
        setModalAccountActivateVisible(true);
        Alert.alert("Congratulations!", "You account has been created");
      }
    } catch (error) {
      Alert.alert("", "Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const loginUserAccount = async () => {
    if (!password) {
      return setPasswordError({
        visible: true,
        message: label.password.required,
      });
    }
    setPasswordError({ visible: false, message: label.password.required });
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      };
      const { data, status } = await axios.post(
        API_URL.LOGIN,
        {
          email,
          password,
        },
        config
      );
      if (status === RESPONSE.OK) {
        await AsyncStorage.setItem(label.USER_TOKEN, JSON.stringify(data));
        setLoading(false);
        props.navigation.reset({
          index: 0,
          routes: [{ name: "ActivityScreen" }],
        });
      } else if (status === RESPONSE.UNAUTHORIZED) {
        Alert.alert("", "Invalid Email / Password");
        setLoading(false);
      } else if (status === RESPONSE.CONFLICT) {
        setModalAccountActivateVisible(true);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("", "Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <AccontVerifyModal
        modalVisible={modalAccountActivateVisible}
        setModalVisible={setModalAccountActivateVisible}
        email={email}
      />
      <PasswordResetModal
        modalVisible={modalPasswordResetVisible}
        setModalVisible={setModalPasswordResetVisible}
        email={email}
      />
      <View style={{ width: "90%", height: "90%", justifyContent: "center" }}>
        <View style={{ alignItems: "center" }}>
          {!keyboard && currentView === VIEWS.LOOKUP_VIEW && (
            <Image source={CollegeLogo} style={{ width: 200, height: 200 }} />
          )}
        </View>

        <Headline style={{ marginTop: 50 }}>{header[currentView]}</Headline>
        <Subheading>{subHeader[currentView]}</Subheading>
        <View>
          <Paragraph
            style={{
              opacity: emailError.visible ? 1 : 0,
              color: DefaultTheme.colors.error,
            }}
          >
            {emailError.message}
          </Paragraph>
          <TextInput
            label="Email"
            value={email}
            autoFocus
            onChangeText={(email) => changeStateAndValidateInput(email)}
            mode="outlined"
            disabled={currentView !== VIEWS.LOOKUP_VIEW || loading}
            error={emailError.visible}
            placeholder="Enter your Islington email"
            right={
              currentView !== VIEWS.LOOKUP_VIEW && (
                <TextInput.Icon
                  name="pencil"
                  onPress={editEmail}
                  style={{ width: 20, height: 20 }}
                  forceTextInputFocus={false}
                />
              )
            }
          />
        </View>

        {currentView === VIEWS.CREATE_VIEW && (
          <View>
            <Paragraph
              style={{
                opacity: fullNameError.visible ? 1 : 0,
                color: DefaultTheme.colors.error,
              }}
            >
              {fullNameError.message}
            </Paragraph>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={(fullName) =>
                changeStateAndValidateInput(fullName, true)
              }
              mode="outlined"
              error={fullNameError.visible}
              placeholder="Enter your full name"
            />
          </View>
        )}

        {currentView !== VIEWS.LOOKUP_VIEW && (
          <View>
            <Paragraph
              style={{
                opacity: passwordError.visible ? 1 : 0,
                color: DefaultTheme.colors.error,
              }}
            >
              {passwordError.message}
            </Paragraph>
            <TextInput
              label="Password"
              value={password}
              onChangeText={(password) =>
                changeStateAndValidateInput(password, false)
              }
              mode="outlined"
              error={passwordError.visible}
              disabled={loading}
              secureTextEntry={isPasswordHidden}
              outlineColor="#3498db"
              placeholder="Enter your password"
              right={
                <TextInput.Icon
                  name="eye"
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  forceTextInputFocus={false}
                />
              }
            />
            {currentView === VIEWS.CREATE_VIEW && (
              <Surface
                style={{ marginVertical: 20, padding: 10, elevation: 4 }}
              >
                <Text>Hint:</Text>
                {label.password.passwordCriteria.map((hint, index) => (
                  <Text key={index}>{hint}</Text>
                ))}
              </Surface>
            )}
          </View>
        )}
        <Button
          mode="contained"
          onPress={handleAccountRegister}
          dark
          style={{ marginTop: 20 }}
          loading={loading}
          disabled={loading}
        >
          {button[currentView]}
        </Button>
        {currentView === VIEWS.LOGIN_VIEW && (
          <TouchableOpacity
            onPress={() => setModalPasswordResetVisible(true)}
            activeOpacity={1}
          >
            <Text style={{ marginTop: 20, textDecorationLine: "underline" }}>
              {label.forgotPassword}
            </Text>
          </TouchableOpacity>
        )}
        {currentView === VIEWS.CREATE_VIEW && (
          <Paragraph style={{ marginTop: 20 }}>
            <Text>{label.consentMessage[0]}</Text>
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => alert(label.termsAndConditions)}
            >
              {label.consentMessage[1]}
            </Text>
            <Text>{label.consentMessage[2]}</Text>
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => alert(label.privacyPolicies)}
            >
              {label.consentMessage[3]}
            </Text>
          </Paragraph>
        )}
      </View>
    </View>
  );
};

export default RegisterPage;
