const emailRegex = /^[A-Za-z0-9._%+-]+@islingtoncollege.edu.np$/;
const passwordRegex = /^(?=.*\d)(?=.*[aA-zZ])[^\[|\]~\{\}]{8,25}$/;
const fullNameRegex = /^[a-zA-Z 0-9 _.$&+,:;=?#\'\/\\\<\>^*()%!\-]*$/;

const isEmailValid = (email) => {
  return emailRegex.test(email);
};

const isPasswordValid = (password) => {
  return passwordRegex.test(password);
};

const isNameValid = (fullName) => {
  return fullNameRegex.test(fullName);
};

module.exports = {
  isEmailValid,
  isPasswordValid,
  isNameValid,
};
