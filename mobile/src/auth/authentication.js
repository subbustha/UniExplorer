import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvX3M4SZMCrwlPHJaK47Au72IHYBIpV0I",
  authDomain: "uniexplorer-821f2.firebaseapp.com",
  databaseURL: "https://uniexplorer-821f2-default-rtdb.firebaseio.com",
  projectId: "uniexplorer-821f2",
  storageBucket: "uniexplorer-821f2.appspot.com",
  messagingSenderId: "528139226512",
  appId: "1:528139226512:web:9ac4b65b9a67a3069cb715",
  measurementId: "G-VJKWZFGX9W",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

const handleLookupAccount = (email, callback) => {
  auth
    .fetchSignInMethodsForEmail(email)
    .then((data) => {
      const isExistingUser = data.length === 1 && data[0] === "password";
      callback(isExistingUser, null);
    })
    .catch((error) => {
      callback(false, error);
    });
};

const handleCreateAccount = (email, password, callback) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      if (user && !user.emailVerified) {
        console.log("User Created and ready to send email verification: ", user)
        return user.sendEmailVerification();
      }
      callback(null, "Error");
    })
    .then((response) => {
      console.log("Create account response = ", response);
      callback("Verify user", null);
    })
    .catch(() => callback(null, "Error"));
};

const handleLoginAccount = (email, password, callback) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      if (user && user.emailVerified) {
        callback(user, null);
      } else {
        callback(user, "Verify user");
      }
    })
    .catch((error) => {
      callback(null, error);
    });
};

export { handleLookupAccount, handleCreateAccount, handleLoginAccount, auth };
