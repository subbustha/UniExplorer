import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Image, Keyboard, Alert } from "react-native";
import {
  Headline,
  Subheading,
  TextInput,
  Button,
  Paragraph,
  Checkbox,
  Surface,
  Text,
} from "react-native-paper";
import { registerConstants, validators } from "../../utils/index";
import { DefaultTheme } from "react-native-paper";
import CollegeLogo from "../../../assets/logo.page/logo.png";
import {
  handleCreateAccount,
  handleLookupAccount,
  handleLoginAccount,
  handleForgotPassword,
} from "../../auth/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {
  VIEWS,
  SMART_LOGIN: { header, subHeader, label, button },
} = registerConstants;
const { emailValidator, passwordValidator } = validators;

const RegisterPage = (props) => {
  const [currentView, setCurrentView] = useState(VIEWS.LOOKUP_VIEW);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({
    visible: false,
    message: label.email.name,
  });
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const [passwordError, setPasswordError] = useState({
    visible: false,
    message: label.password.name,
  });
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [persistentLogin, setPersistentLogin] = useState(true);
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

  const triggerPasswordResetProtocol = () => {
    Alert.alert(
      "Password Reset Confirmation",
      "An email will be sent to your provided email with password reset instructions.",
      [
        {
          text: "Confirm",
          onPress: () =>
            handleForgotPassword(email, (success) => {
              alert(
                success
                  ? "Password reset instructions are send to your device."
                  : "Could not reset password. Please try again later"
              );
            }),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const changeStateAndValidateInput = (input) => {
    if (currentView === VIEWS.LOOKUP_VIEW) {
      setEmail(input.trim());
      setEmailError(emailValidator(input.trim(), emailError));
    } else if (currentView === VIEWS.CREATE_VIEW) {
      setPassword(input);
      setPasswordError(passwordValidator(input, passwordError));
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

  const lookupUserAccount = () => {
    if (emailError.message !== label.email.name) {
      return setEmailError({ ...emailError, visible: true });
    }
    if (!email) {
      return setEmailError({ visible: true, message: label.email.required });
    }
    setLoading(true);
    handleLookupAccount(email, (userAccountFound, error) => {
      if (error) {
        return alert("Something went wrong. Please try again later.");
      }
      setCurrentView(userAccountFound ? VIEWS.LOGIN_VIEW : VIEWS.CREATE_VIEW);
      setLoading(false);
      passwordRef.current.focus();
    });
  };

  const createUserAccount = () => {
    if (passwordError.message !== label.password.name) {
      return setPasswordError({ ...passwordError, visible: true });
    }
    if (!password) {
      return setPasswordError({
        visible: true,
        message: label.password.required,
      });
    }
    setLoading(true);
    handleCreateAccount(email, password, (user, error) => {
      if (user) {
        setCurrentView(VIEWS.LOGIN_VIEW);
        alert("Please check your email for verification and sign in.");
      } else if (error) {
        alert("Could not create account. Please try again later.");
      }
      setLoading(false);
    });
  };

  const loginUserAccount = () => {
    setLoading(true);
    handleLoginAccount(email, password, async (user, error) => {
      if (user && !error) {
        await AsyncStorage.setItem(
          label.PERSISTENT_LOGIN_KEY,
          JSON.stringify(persistentLogin)
        );
        props.navigation.reset({
          index: 0,
          routes: [{ name: "ActivityScreen" }],
        });
      } else if (user && error) {
        setLoading(false);
        alert("Vefication pending. Please verify your email.");
      } else if (!user && error) {
        setLoading(false);
        alert("Username / Password Error");
      }
    });
  };

  return (
    <View style={{ display: "flex", alignItems: "center" }}>
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
              ref={passwordRef}
              onChangeText={(password) => changeStateAndValidateInput(password)}
              mode="outlined"
              error={passwordError.visible}
              disabled={loading}
              secureTextEntry={isPasswordHidden}
              outlineColor="#3498db"
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
            {currentView === VIEWS.LOGIN_VIEW && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Checkbox.Android
                  status={persistentLogin ? "checked" : "unchecked"}
                  color="black"
                  onPress={() => setPersistentLogin(!persistentLogin)}
                />
                <Subheading>{label.persistentLogin}</Subheading>
              </View>
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
          <Text
            style={{ marginTop: 20, textDecorationLine: "underline" }}
            onPress={triggerPasswordResetProtocol}
          >
            {label.forgotPassword}
          </Text>
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

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
});

export default RegisterPage;
