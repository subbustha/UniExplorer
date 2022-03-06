import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerConstants } from "../utils/index";
import axios from "axios";

const verifyIfUserIsLoggedIn = async () => {
  const {
    SMART_LOGIN: {
      label: { USER_TOKEN },
    },
    API_URL: { LOOKUP },
  } = registerConstants;
  try {
    const user = JSON.parse(await AsyncStorage.getItem(USER_TOKEN));
    if (!user || !user?.token) {
      return false;
    } else {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.get(LOOKUP, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

const logOutUser = async() => {
  try{
    await AsyncStorage.clear();
    return true;
  }catch(error){
    return false;
  }
}

export { verifyIfUserIsLoggedIn, logOutUser };
