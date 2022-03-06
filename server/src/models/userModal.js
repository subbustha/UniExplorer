//Schema Design for user (customers)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Properties Include: name, email, password, token, accessCode
const userSchema = new Schema({
  fullName: {
    //User name
    type: String,
    required: true,
    trim: true,
  },
  email: {
    //User email
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    //Hashed password
    type: String,
    required: true,
  },
  token: {
    //User Token
    type: String,
    required: true,
    default: "null",
  },
  emailVerified: {
    //User Email Verification
    type: Boolean,
    required: true,
    default: false,
  },
  accessCode: {
    //Reset code used to reset user password
    type: String,
    requried: false,
    default: "",
  },
});

/////////////////////////////////////Methods////////////////////////////////////////
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject._id, delete userObject.__v;
  delete userObject.password;
  delete userObject.accessCode;
  return userObject;
};
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return token;
};
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////Pre/////////////////////////////////////////////////

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////Statics////////////////////////////////////////////

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : null;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
