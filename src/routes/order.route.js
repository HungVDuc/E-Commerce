const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/auth.middleware");

// User
router.post("/", verifyAccessToken, orderController.createOrder);
router.get("/:id", verifyAccessToken, orderController.getOrderById);

// Admin
router.get("/", verifyAccessToken, isAdmin, orderController.getAllOrders);
router.patch("/status/:id", verifyAccessToken, isAdmin, orderController.updateOrderStatus);
router.delete("/:id", verifyAccessToken, isAdmin, orderController.deleteOrder);

module.exports = router;
