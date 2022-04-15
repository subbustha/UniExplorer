//Authentication for admin verification.
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");
const log = require("../services/logger");
const {
  UNAUTHORIZED,
  INVALID_DATA_PROVIDED,
  INTERNAL_SERVER_ERROR,
} = require("../services/http-response");
const fileName = "adminCreateMiddleware";
const adminAccessMiddleware = async (request, response, next) => {
  const methodName = "adminCreateMiddleware";
  try {
    const authToken = request.header("Authorization");
    if (!authToken || (authToken + "").toLowerCase() === "null") {
      log.info(fileName, methodName, "Regular user account create detected");
      return next();
    }
    const token = authToken.replace("Bearer ", "");
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
    request.isSuperAdminRequest =
      user.email.toLowerCase() === process.env.SUPER_ADMIN;
    next();
  } catch (error) {
    log.error(fileName, methodName, error);
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
};

module.exports = adminAccessMiddleware;
