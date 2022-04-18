import axios from "axios";
import { getLocalAuthConfig, FEEDBACK_BASE_URL } from "./constants";


export const sendFeedback = async (message) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.post(FEEDBACK_BASE_URL, { message }, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const getFeedback = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      const { data = [] } = await axios.get(FEEDBACK_BASE_URL, config);
      return data;
    }
  } catch (error) {
    return false;
  }
};
