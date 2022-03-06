const SMART_LOGIN = {
  header: {
    register: "Sign in to Your Account",
    login: "Welcome back!",
    create: "Create An Account",
  },
  subHeader: {
    register: "Enter your Islington college email!",
    login: "Sign in to your account!",
    create: "Enter a password to create an account",
  },
  label: {
    email: {
      name: "Email",
      required: "Please enter an email address",
      invalid: "Please enter a valid email address",
      emailRegex: /^[A-Za-z0-9._%+-]+@islingtoncollege.edu.np$/,
    },
    password: {
      name: "Password",
      required: "Please enter a password",
      invalid: "Please enter a valid password",
      passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/,
      passwordCriteria: [
        "- At least one upper and lower case letter",
        "- At least one number (0-9)",
        "- Between 8 to 25 characters long",
        "- No special character",
      ],
    },
    fullName: {
      name: "Full Name",
      required: "Please enter your name",
      invalid: "Please enter a valid name",
      fullNameRegex: /^[a-zA-Z 0-9 _.\'\-]{1,40}$/
    },
    accessCode: {
      codeRegex: /^[a-zA-Z0-9]{5}$/,
    },
    persistentLogin: "Keep me signed in",
    USER_TOKEN: "USER_TOKEN",
    forgotPassword: "Forgot your password?",
    consentMessage: [
      "By creating an account you agree with our, ",
      "Terms and Conditions ",
      "and our ",
      "Privacy Policies.",
    ],
    termsAndConditions: "Here is terms and conditions",
    privacyPolicies: "Here is privacy policies",
  },
  button: {
    register: "Contine",
    login: "Login Account",
    create: "Create Account",
  },
};

const VIEWS = {
  LOOKUP_VIEW: "register",
  LOGIN_VIEW: "login",
  CREATE_VIEW: "create",
};

const BASE_ENDPOINT = "http://192.168.1.99:5000";

const API_URL = {
  LOOKUP: BASE_ENDPOINT + "/api/user",
  LOGIN: BASE_ENDPOINT + "/api/user/login",
  CREATE: BASE_ENDPOINT + "/api/user/create",
  ACTIVATION_CODE: BASE_ENDPOINT + "/api/user/send/activation",
  ACTIVATE: BASE_ENDPOINT + "/api/user/activate",
  PASSWORD_RESET_CODE: BASE_ENDPOINT + "/api/user/send/reset",
  PASSWORD_RESET: BASE_ENDPOINT + "/api/user/reset",
};

export { SMART_LOGIN, VIEWS, API_URL };
