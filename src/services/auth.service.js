const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwtUtil = require("../utils/jwt.util");
const userRepository = require("../repositories/user.repository");
const Errors = require("../errors/error-factory");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

const register = async (name, email, password, phone = "", address = "") => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw Errors.EMAIL_ALREADY_EXISTS();

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userRepository.createUser({
    name,
    email,
    passwordHash: hashedPassword,
    phone,
    address,
    role: "customer",
  });
  return newUser;
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw Errors.INVALID_CREDENTIALS();

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw Errors.INVALID_CREDENTIALS();

  const payload = { userId: user._id, role: user.role };

  const accessToken = jwtUtil.generateAccessToken(payload);
  const refreshToken = jwtUtil.generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

const refreshAccessToken = (oldRefreshToken) => {
  if (!oldRefreshToken) throw Errors.UNAUTHORIZED();

  const decoded = jwtUtil.verifyRefreshToken(oldRefreshToken);

  const payload = {
    userId: decoded.userId,
    role: decoded.role,
  };

  const accessToken = jwtUtil.generateAccessToken(payload);
  const refreshToken = jwtUtil.generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

const getGoogleAuthRedirectUrl = () => {
  const baseUrl = "https://accounts.google.com/o/oauth2/auth";

  const query = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent",
    flowName: "GeneralOAuthFlow",
  });
  return `${baseUrl}?${query.toString()}`;
};

const handleGoogleCallback = async (code) => {
  const querystring = require("querystring");

  const tokenData = querystring.stringify({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });
  // Lấy token từ Google
  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    tokenData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const { access_token } = tokenRes.data;

  // Lấy thông tin người dùng
  const userInfo = await axios.get(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
  );

  const { email, name } = userInfo.data;

  let user = await userRepository.findByEmail(email);

  if (!user) {
    user = await userRepository.createUser({
      name,
      email,
      passwordHash: "google", // Không được phép để rỗng
      role: "customer",
      phone: "",
      address: "",
    });
  }

  const payload = { userId: user._id, role: user.role };

  const accessToken = jwtUtil.generateAccessToken(payload);
  const refreshToken = jwtUtil.generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

const authService = {
  register,
  login,
  refreshAccessToken,
  getGoogleAuthRedirectUrl,
  handleGoogleCallback,
};

module.exports = authService;
