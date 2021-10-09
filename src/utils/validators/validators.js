import { SMART_LOGIN } from "../constants/regiser.constant";

const {
  label: { email, password },
} = SMART_LOGIN;

const emailValidator = (payload, payloadState) => {
  if (payload === "") {
    return { ...payloadState, message: email.required };
  } else if (!email.emailRegex.test(payload)) {
    return { ...payloadState, message: email.invalid };
  } else {
    return { visible: false, message: email.name };
  }
};

const passwordValidator = (payload, payloadState) => {
  // alert(payload);
  if (payload === "") {
    return { ...payloadState, message: password.required };
  } else if (!password.passwordRegex.test(payload)) {
    return { ...payloadState, message: password.invalid };
  } else {
    return { visible: false, message: password.name };
  }
};

export { emailValidator, passwordValidator };
