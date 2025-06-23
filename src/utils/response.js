const sendResponse = (
  res,
  { result = null, code = 200, message = "Success!" }
) => {
  return res.status(code).json({
    code,
    message,
    result,
  });
};

module.exports = sendResponse;
