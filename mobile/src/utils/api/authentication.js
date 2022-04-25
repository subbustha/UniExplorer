import axios from "axios";
import {
  USER_BASE_URL,
  USER_LOGOUT_URL,
  getLocalAuthConfig,
} from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const verifyIfUserIsLoggedIn = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.get(USER_BASE_URL, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

const logOutUser = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      await AsyncStorage.clear();
      return;
    } else {
      await axios.patch(USER_LOGOUT_URL, config);
      await AsyncStorage.clear();
      return;
    }
  } catch (error) {
    await AsyncStorage.clear();
    return;
  }
};

export { verifyIfUserIsLoggedIn, logOutUser };
