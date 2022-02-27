//Schema Design for admin
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Properties Include: name, email, password, super, tokens, resetCode
const adminSchema = new Schema({
  fullName: {
    //Admin name
    type: String,
    required: true,
    trim: true,
  },
  email: {
    //Admin email
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
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject._id;
  delete adminObject.__v;
  delete adminObject.password;
  delete adminObject.accessCode;
  return adminObject;
};
adminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  return token;
};
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////Pre/////////////////////////////////////////////////
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////Statics////////////////////////////////////////////
adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Invalid id or password");
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid id or password");
  }
  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
