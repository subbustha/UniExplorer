import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Headline,
  Subheading,
  TextInput,
  Button,
  Paragraph,
  Checkbox,
} from "react-native-paper";
import Services from "../../service/regiser.constant";
import {DefaultTheme} from "react-native-paper";

const { VIEWS, SMART_LOGIN } = Services;
const { header, subHeader, label, button } = SMART_LOGIN;

const RegisterPage = () => {
  const [currentView, setCurrentView] = useState(VIEWS.LOOKUP_VIEW);
  const [email, setEmail] = useState("");
  const emailRef = useRef(null);
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

  const changeStateAndValidateInput = (input) => {
    if (currentView === VIEWS.LOOKUP_VIEW) {
      setEmail(input);
      if (input === "") {
        setEmailError({ ...emailError, message: label.email.required });
      } else if (!label.email.emailRegex.test(input)) {
        setEmailError({ ...emailError, message: label.email.invalid });
      } else {
        setEmailError({ visible: false, message: label.email.name });
      }
    } else {
      setPassword(input);
      if (input === "") {
        setPasswordError({ ...passwordError, message: label.email.required });
      } else if (label.password.passwordRegex.test(input)) {
        setPasswordError({ ...passwordError, message: label.email.invalid });
      } else {
        setPasswordError({ visible: false, message: label.password.name });
      }
    }
  };

  const editEmail = () => {
      setCurrentView(VIEWS.LOOKUP_VIEW);
      emailRef.current.focus();
  }

  const lookupUserAccount = () => {
    if (emailError.message !== label.email.name) {
      return setEmailError({ ...emailError, visible: true });
    }
    if(email === "") {
      return setEmailError({visible: true, message: label.email.required});
    }
    setLoading(true);
    //TODO: Account lookup api call
    setTimeout(() => {
      setLoading(false);
      setCurrentView(VIEWS.LOGIN_VIEW);
      passwordRef.current.focus();
    }, 3000)
    
  };
  const createUserAccount = () => {};
  const loginUserAccount = () => {};

  return (
    <View style={{ flex: 1, width: "90%" }}>
      <Headline style={{marginTop:50}}>{header[currentView]}</Headline>
      <Subheading>{subHeader[currentView]}</Subheading>
      <View>
        <Paragraph style={{ opacity: emailError.visible ? 1 : 0, color: DefaultTheme.colors.error }}>
          {emailError.message}
        </Paragraph>
        <TextInput
          label="Email"
          value={email}
          autoFocus
          ref={emailRef}
          onChangeText={(email) => changeStateAndValidateInput(email)}
          mode="outlined"
          disabled={(currentView!==VIEWS.LOOKUP_VIEW || loading)}
          error={emailError.visible}
          right={
            currentView !== VIEWS.LOOKUP_VIEW && (
              <TextInput.Icon
                name="pencil"
                onPress={editEmail}
                style={{width:20, height:20}}
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
              opacity:
                passwordError && currentView === VIEWS.CREATE_VIEW ? 1 : 0,
            }}
          >
            Hello World
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
        </View>
      )}
      <Button
        mode="contained"
        onPress={lookupUserAccount}
        dark
        style={{ marginTop: 20 }}
        loading={loading}
        disabled={loading}
      >
        {button[currentView]}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
});

export default RegisterPage;
