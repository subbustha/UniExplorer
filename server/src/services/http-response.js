module.exports = {
  OK: {
    status: 200,
    message: "OK",
  },
  INVALID_DATA_PROVIDED: {
    status: 400,
    message: "Invalid parameter from client",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "User is not authorized",
  },
  AUTHORIZED: {
    status: 202,
    message: "User is authorized",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
  CREATED: {
    status: 201,
    message: "Created",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not found",
  },
  CONFLICT: {
      status: 406,
      message: "Conflict"
  }
};
