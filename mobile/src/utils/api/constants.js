import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_TOKEN = "USER_TOKEN";

export const getLocalAuthConfig = async () => {
  try {
    const user = JSON.parse(await AsyncStorage.getItem(USER_TOKEN));
    if (user?.token) {
      authToken = user.token;
      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getLocalUserInfo = async () => {
  try {
    const user = JSON.parse(await AsyncStorage.getItem(USER_TOKEN));
    return user ? user : null;
  } catch (error) {
    return null;
  }
};

export const isAdmin = async () => {
  try {
    const user = JSON.parse(await AsyncStorage.getItem(USER_TOKEN));
    return user ? user.isAdmin : null;
  } catch (error) {
    return null;
  }
};

export const API_BASE_URL = "http://localhost:5000/api/";

export const HOME_BASE_URL = API_BASE_URL + "home/";

export const USER_BASE_URL = API_BASE_URL + "user/";

export const USER_CREATE_URL = USER_BASE_URL + "create/";

export const USER_LOGIN_URL = USER_BASE_URL + "login/";

export const USER_LOGOUT_URL = USER_BASE_URL + "logout/";

export const USER_SEND_ACTIVATION_CODE = USER_BASE_URL + "send/activation/";

export const USER_CONFRIM_ACTIVATION_CODE = USER_BASE_URL + "activate/";

export const USER_SEND_PASSWOR_RESET_CODE = "send/reset/";

export const USER_CONFIRM_PASSWORD_RESET = "reset/";

export const IMAGE_BASE_URL = API_BASE_URL + "image/";

export const LAF_BASE_URL = API_BASE_URL + "item/";

export const FEEDBACK_BASE_URL = API_BASE_URL + "feedback/";
