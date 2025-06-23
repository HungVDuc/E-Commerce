const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "30m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
