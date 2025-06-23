const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/auth.middleware");

// Public route
router.get("/", categoryController.listForUser);

// Admin route
router.get("/admin", verifyAccessToken, isAdmin, categoryController.listForAdmin);
router.post("/", verifyAccessToken, isAdmin, categoryController.create);
router.put("/:id", verifyAccessToken, isAdmin, categoryController.update);
router.delete("/:id", verifyAccessToken, isAdmin, categoryController.remove);

module.exports = router;