const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/auth.middleware");

router.get("/me", verifyAccessToken, userController.getProfile);


module.exports = router;