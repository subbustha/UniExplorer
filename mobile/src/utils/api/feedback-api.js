import axios from "axios";
import { getLocalAuthConfig, FEEDBACK_BASE_URL } from "./constants";

export const getFeedback = async () => {};

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

export const deleteFeedback = async () => {};
