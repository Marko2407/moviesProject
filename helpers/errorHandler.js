exports.customError = (msg, code) => {
  const error = new Error(msg);
  error.code = code;
  return error;
};
