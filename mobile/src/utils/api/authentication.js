import axios from "axios";
import { USER_BASE_URL, getLocalAuthConfig } from "./constants";

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
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
};

export { verifyIfUserIsLoggedIn, logOutUser };
