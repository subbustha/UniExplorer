import axios from "axios";
import {
  getLocalAuthConfig,
  USER_BASE_URL,
  USER_LOGIN_URL,
  USER_CREATE_URL,
  USER_SEND_ACTIVATION_CODE,
  USER_CONFRIM_ACTIVATION_CODE,
} from "./constants";
import RESPONSE from "./http-response";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const lookupUserAccount = async (email) => {
  try {
    config.validateStatus = (status) => status < 500;
    const { status } = await axios.get(USER_BASE_URL + email, config);
    console.log("status = " + status);
    if (status === RESPONSE.OK) {
      return "LOGIN";
    } else if (status === RESPONSE.NOT_FOUND) {
      return "CREATE";
    } else if (status === RESPONSE.CONFLICT) {
      return "ACTIVATE";
    }
    return "";
  } catch (error) {
    return "";
  }
};

export const createUserAccount = async (userData) => {
  try {
    const createAccountConfig = await getLocalAuthConfig();
    if (!createAccountConfig) {
      return false;
    }
    const { status } = await axios.post(
      USER_CREATE_URL,
      userData,
      createAccountConfig
    );
    if (status === RESPONSE.CREATED) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const loginUserAccount = async (userData) => {
  try {
    config.validateStatus = (status) => status < 500;
    const { status, data } = await axios.post(USER_LOGIN_URL, userData, config);
    if (status === RESPONSE.OK) {
      return [false, data];
    }
    if (status === RESPONSE.UNAUTHORIZED) {
      return [true, false];
    }
    return [false, false];
  } catch (error) {
    return [false, false];
  }
};

export const sendAcitvationCodeToMail = async (email) => {
  try {
    await axios.patch(USER_SEND_ACTIVATION_CODE, { email }, config);
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyActivationCode = async (payload) => {
  try {
    await axios.patch(USER_CONFRIM_ACTIVATION_CODE, payload, config);
    return true;
  } catch (error) {
    return false;
  }
};
