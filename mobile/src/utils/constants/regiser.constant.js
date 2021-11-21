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
        "- Password must have one upper and lower case letter",
        "- Must have one numer and more than 8 characters",
        "- Must not containa any special character",
      ],
    },
    persistentLogin: "Keep me signed in",
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

export { SMART_LOGIN, VIEWS };
