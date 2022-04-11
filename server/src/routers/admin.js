const { Router } = require("express");
const Admin = require("../models/adminModel");
const router = new Router();
const authAdmin = require("../middleware/authAdmin");
const { sendVerificationCode } = require("../mail/sendmail");
const randomstring = require("randomstring");
const log = require("../services/logger");
const {
  INVALID_DATA_PROVIDED,
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  CREATED,
  CONFLICT,
} = require("../services/http-response");
const {
  isEmailValid,
  isPasswordValid,
  isNameValid,
} = require("../services/validator");
const fileName = "admin.js";

//Router for admin login
router.post("/api/admin/login", async (request, response) => {
  const methodName = "AdminLoginRoute";
  try {
    let { email = null, password = null } = request.body;
    if (
      !email ||
      !password ||
      !isEmailValid(email) ||
      !isPasswordValid(password)
    ) {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    email = email.toLowerCase();
    const admin = await Admin.findByCredentials(email, password);
    if (!admin) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (!admin.emailVerified) {
      return response.status(CONFLICT.status).send(CONFLICT.message);
    }
    const token = await admin.generateAuthToken();
    admin.token = token;
    await admin.save();
    response.status(OK.status).send(admin);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
//Router for admin logout
router.post("/api/admin/logout", authAdmin, async (request, response) => {
  try {
    request.admin.tokens = request.admin.tokens.filter(
      (token) => token.token !== request.token
    );
    await request.admin.save();
    response.status(200).send("Logged Out");
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
//Router for creating new admin
router.post("/api/admin/create", async (request, response) => {
  try {
    const admin = new Admin(request.body);
    const token = await admin.generateAuthToken();
    admin.token = token;
    await admin.save();
    response.status(201).send(admin);
  } catch (error) {
    response.status(500).send(error.message);
  }
});

//Router for updating admin password. Name and email update is forbidden
router.patch("/api/admin", authAdmin, async (request, response) => {
  try {
    const adminData = Object.keys(request.body);
    const allowedData = ["password", "newPassword"];
    const isValidOperation = adminData.every((data) =>
      allowedData.includes(data)
    );
    if (!isValidOperation) {
      return response.status(406).send("Invalid Data");
    }
    const admin = request.admin;
    adminData.forEach((data) => {
      admin[data] = request.body[data];
    });
    await admin.save();
    response.status(200).send(admin);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
//Router for deleting admin data
router.delete("/api/admin", authAdmin, async (request, response) => {
  if (!request.admin.super) {
    return response.status(401).send("Unauthorized");
  }
  try {
    const email = request.header("Email");
    console.log("Email is " + email);
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return response.status(404).send("Admin not found.");
    }
    await admin.remove();
    response.status(202).send("Admin Removed");
  } catch (error) {
    console.log("There is an error " + error);
    response.status(500).send("Internal Server Error");
  }
});

//Router for getting admin data
router.get("/api/admin", authAdmin, async (request, response) => {
  const methodName = "AdminTokenCheckRoute";
  try {
    log.info(fileName, methodName, OK.message);
    response.status(OK.status).send(OK.message);
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
//Router for getting adll admin data//Only for super admin
router.get("/api/admin/all", authAdmin, async (request, response) => {
  if (!request.admin.super) {
    return response.status(401).send("Unauthorized");
  }
  try {
    const admins = await Admin.find({ super: false });
    if (admins.length === 0) {
      return response.status(404).send("No admins found.");
    }
    response.status(200).send(admins);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});

//Router for knowing if a admin exist for reseting password purpose.
router.patch("/api/admin/reset", async (request, response) => {
  if (!request.body.email) {
    return response.status(406).send("Email not provided");
  }
  try {
    const admin = await Admin.findOne({ email: request.body.email });
    if (!admin) {
      return response.status(404).send("Admin not found.");
    }
    const code = randomstring.generate(5);
    admin.resetCode = code;
    await admin.save();
    sendVerificationCode(request.body.email, code);
    response.status(200).send("Code sent to the account");
    //Using api to generatre passcode and then storing it on user database for verification
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
//Chaning the password by verifying the auth code from database
router.patch("/api/admin/reset/password", async (request, response) => {
  if (!request.body.email) {
    return response.status(406).send("Email not provided");
  }
  try {
    const admin = await Admin.findOne({ email: request.body.email });
    if (!admin) {
      return response.status(404).send("Admin not found.");
    }
    if (request.body.authCode !== admin.resetCode) {
      admin["resetCode"] = "";
      await admin.save();
      return response
        .status(400)
        .send("Couldnot perform operation. Please try from beginning.");
    }
    admin["password"] = request.body.password;
    await admin.save();
    response.status(200).send("Code sent to the account");
    //Using api to generatre passcode and then storing it on user database for verification
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
