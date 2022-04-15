import axios from "axios";
import { getLocalAuthConfig, HOME_BASE_URL } from "./constants";

export const getHomePageData = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return [];
    } else {
      const { data = [] } = await axios.get(HOME_BASE_URL, config);
      return data;
    }
  } catch (error) {
    return [];
  }
};
