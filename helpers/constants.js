exports.errorName = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  MOVIE_NOT_FOUND: "MOVIE_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN: "UKNOWN_ERROR",
  TOKEN_TIMEOUT: "TOKEN_TIMEOUT",
};

exports.errorType = {
  USER_ALREADY_EXISTS: {
    message: "User is already exists.",
    code: 403,
  },
  SERVER_ERROR: {
    message: "Server error.",
    code: 500,
  },
  UNKNOWN: {
    message: "Uknown error.",
    code: 400,
  },
  USER_NOT_FOUND: {
    message: "User not found.",
    code: 404,
  },
  MOVIE_NOT_FOUND: {
    message: "Movie not found.",
    code: 404,
  },
  UNAUTHORIZED: {
    message: "Wrong credentials or token has expired.",
    code: 401,
  },
};
