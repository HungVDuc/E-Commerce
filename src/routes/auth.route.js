const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Xác thực tại local
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshAccessToken);

// Xác thực Google

// 1. Chuyển hướng người dùng đến trang đăng nhập Google
router.get("/google", authController.googleAuthRedirect);

// 2. Google callback sau khi người dùng xác thực
router.get("/google/callback", authController.googleCallback);




module.exports = router;
