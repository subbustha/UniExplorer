import React, { useState, useEffect } from "react";
import { View, Image, Keyboard, Alert, TouchableOpacity } from "react-native";
import {
  Headline,
  Subheading,
  TextInput,
  Button,
  Paragraph,
  Surface,
  Text,
} from "react-native-paper";
import { SMART_LOGIN, VIEWS, API_URL } from "./regiser.constant";
import {
  emailValidator,
  passwordValidator,
  fullNameValidator,
} from "../../utils/validators/validators";
import RESPONSE from "../../utils/api/http-response";
import { DefaultTheme } from "react-native-paper";
import CollegeLogo from "../../images/logo.page/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AccontVerifyModal from "./account.verify.modal";
import PasswordResetModal from "./password.reset.modal";
import {
  lookupUserAccount,
  createUserAccount,
  loginUserAccount,
} from "../../utils/api/user-api";

const { header, subHeader, label, button } = SMART_LOGIN;

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
        lookupUserAccountViaApi();
        break;
      case VIEWS.CREATE_VIEW:
        createUserAccountViaApi();
        break;
      case VIEWS.LOGIN_VIEW:
        loginUserAccountViaApi();
        break;
    }
  };

  const lookupUserAccountViaApi = async () => {
    if (emailError.message !== label.email.name) {
      return setEmailError({ ...emailError, visible: true });
    }
    if (!email) {
      return setEmailError({ visible: true, message: label.email.required });
    }
    setLoading(true);
    try {
      const result = await lookupUserAccount(email);
      if (result) {
        if (result === "LOGIN") {
          setCurrentView(VIEWS.LOGIN_VIEW);
        } else if (result === "CREATE") {
          setCurrentView(VIEWS.CREATE_VIEW);
        } else if (result === "ACTIVATE") {
          setModalAccountActivateVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const createUserAccountViaApi = async () => {
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
      const result = await createUserAccount({ email, password, fullName });
      if (result) {
        setCurrentView(VIEWS.LOGIN_VIEW);
        setModalAccountActivateVisible(true);
        Alert.alert("Congratulations!", "You account has been created");
      }
    } catch (error) {
      Alert.alert("", "Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const loginUserAccountViaApi = async () => {
    if (!password) {
      return setPasswordError({
        visible: true,
        message: label.password.required,
      });
    }
    setPasswordError({ visible: false, message: label.password.required });
    setLoading(true);
    try {
      const [unauth, data] = await loginUserAccount({ email, password });
      if (data) {
        await AsyncStorage.setItem(label.USER_TOKEN, JSON.stringify(data));
        setLoading(false);
        props.navigation.reset({
          index: 0,
          routes: [{ name: "ActivityScreen" }],
        });
      } else if (unauth && !data) {
        Alert.alert("", "Invalid Email / Password");
        setLoading(false);
      } else if (!unauth && !data) {
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
