//Authentication for admin verification.
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");
const log = require("../services/logger");
const {
  UNAUTHORIZED,
  INVALID_DATA_PROVIDED,
  INTERNAL_SERVER_ERROR,
} = require("../services/http-response");
const authAdmin = async (request, response, next) => {
  const fileName = "authAdmin";
  try {
    const token = request.header("Authorization").replace("Bearer ", "");
    if (!token || (token + "").toLowerCase() === "null") {
      log.warn(fileName, methodName, INVALID_DATA_PROVIDED.message);
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, token: token });
    if (!user) {
      log.warn(fileName, methodName, UNAUTHORIZED.message);
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (!user.isAdmin) {
      log.warn(fileName, methodName, UNAUTHORIZED.message);
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    request.admin = user;
    request.token = token;
    request.adminId = decoded._id;
    next();
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
};

module.exports = authAdmin;
