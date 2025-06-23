const authService = require("../services/auth.service");
const userResource = require("../resources/user.resource");
const Errors = require("../errors/error-factory");
const sendResponse = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    sendResponse(res, {
      result: { user: userResource(user) },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    // Gửi refreshToken vào cookie (HTTP-only, Secure nếu production)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      result: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      authService.refreshAccessToken(oldRefreshToken);

    // Gửi refreshToken vào cookie (HTTP-only, Secure nếu production)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      result: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleAuthRedirect = (req, res) => {
  const url = authService.getGoogleAuthRedirectUrl();
  return res.redirect(url);
};

const googleCallback = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } =
      await authService.handleGoogleCallback(req.query.code);

    // Gửi refreshToken vào cookie (HTTP-only, Secure nếu production)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, {
      message: "Login with Google successfully",
      result: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const authController = {
  register,
  login,
  refreshAccessToken,
  googleAuthRedirect,
  googleCallback,
};

module.exports = authController;
