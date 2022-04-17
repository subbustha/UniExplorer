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

export const deleteImageById = async (collectionName, identifier, imageId) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      const apiUrl =
        IMAGE_BASE_URL + collectionName + "/" + identifier + "/" + imageId;
      console.log(apiUrl);
      await axios.delete(apiUrl, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const uploadImageViaApi = async (
  collectionName,
  identifier,
  formData
) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      const apiUrl = IMAGE_BASE_URL + collectionName + "/" + identifier;
      console.log(apiUrl);
      await axios.patch(apiUrl, formData, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

