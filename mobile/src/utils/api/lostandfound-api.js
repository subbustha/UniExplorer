import axios from "axios";
import { getLocalAuthConfig, LAF_BASE_URL } from "./constants";

export const getLostAndFoundData = async () => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      const { data = [] } = await axios.get(LAF_BASE_URL, config);
      return data;
    }
  } catch (error) {
    return false;
  }
};

export const deleteLostAndFoundData = async (identifier) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.delete(LAF_BASE_URL + identifier, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const editLostAndFoundData = async (identifier, payload) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.patch(LAF_BASE_URL + identifier, payload, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const createLostAndFoundData = async (formData) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.post(LAF_BASE_URL, formData, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};
