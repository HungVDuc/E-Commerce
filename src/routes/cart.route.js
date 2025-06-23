const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");

router.use(verifyAccessToken);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.delete("/remove/:productVariantId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;