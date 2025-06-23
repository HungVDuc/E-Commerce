const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  // Trả về JSON rõ ràng
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
