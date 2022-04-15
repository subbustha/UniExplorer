import axios from "axios";
import { getLocalAuthConfig, LAF_BASE_URL } from "./constants";

export const getLostAndFoundData = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return [];
    } else {
      const { data = [] } = await axios.get(LAF_BASE_URL, config);
      return data;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
