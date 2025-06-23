const jwtUtil = require("../utils/jwt.util");
const Errors = require("../errors/error-factory");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(Errors.UNAUTHORIZED());
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtUtil.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(Errors.TOKEN_EXPIRED());
    }
    return next(Errors.UNAUTHORIZED());
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(Errors.FORBIDDEN());
  }
  next();
};

module.exports = {
  verifyAccessToken,
  isAdmin,
};
