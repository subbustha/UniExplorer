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

export const editHomePageData = async (identifier, payload) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.patch(HOME_BASE_URL + identifier, payload, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const deleteHomePageData = async (identifier) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.delete(HOME_BASE_URL + identifier, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const createHomePageData = async (formData) => {
  try {
    const config = await getLocalAuthConfig();
    if (!config) {
      return false;
    } else {
      await axios.post(HOME_BASE_URL, formData, config);
      return true;
    }
  } catch (error) {
    return false;
  }
};
