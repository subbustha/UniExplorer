import axios from "axios";
import { IMAGE_BASE_URL, getLocalAuthConfig } from "./constants";

export const getImageById = async (imageId) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return "";
    } else {
      const { data = "" } = await axios.get(IMAGE_BASE_URL + imageId, config);
      return data;
    }
  } catch (error) {
    return "";
  }
};
