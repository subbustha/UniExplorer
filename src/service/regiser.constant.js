const SMART_LOGIN = {
    header: {
        register: "Sign in to Your Account",
        login: "Welcome back!",
        create: "Create An Account"
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
            emailRegex:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        password: {
            name: "Password",
            required: "Please enter a password",
            validity: "Please enter a valid password",
            passwordRegex:""
        },
        persistentLogin: "Keep me signed in",
        forgotPassword: "Forgot your password?",
        consentMessage: "By creating an account you agree with your Terms and Conditions and our Privacy Policies.",
    },
    button: {
        register: "Contine",
        login: "Login Account",
        create: "Create Account",
    }
};

const VIEWS = {
    LOOKUP_VIEW: "register",
    LOGIN_VIEW: "login",
    CREATE_VIEW: "create",
}

export default {
    SMART_LOGIN,
    VIEWS
}