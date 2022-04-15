import { SMART_LOGIN } from "../../pages/register.page/regiser.constant";

const {
  label: { email, password, fullName },
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
  if (payload === "") {
    return { ...payloadState, message: password.required };
  } else if (!password.passwordRegex.test(payload)) {
    return { ...payloadState, message: password.invalid };
  } else {
    return { visible: false, message: password.name };
  }
};

const fullNameValidator = (payload, payloadState) => {
  if (payload === "") {
    return { ...payloadState, message: fullName.required };
  } else if (!fullName.fullNameRegex.test(payload)) {
    return { ...payloadState, message: fullName.invalid };
  } else {
    return { visible: false, message: fullName.name };
  }
};

export { emailValidator, passwordValidator, fullNameValidator };
