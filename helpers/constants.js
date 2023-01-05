exports.errorName = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN:"UKNOWN_ERROR"
};

exports.errorType = {
  USER_ALREADY_EXISTS: {
    message: "User is already exists.",
    statusCode: 403,
  },
  SERVER_ERROR: {
    message: "Server error.",
    statusCode: 500,
  },
  UNKNOWN: {
    message: "Uknown error.",
    statusCode: 400,
  },
};
