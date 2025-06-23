const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
require("multer")

// Admin
router.get("/admin", verifyAccessToken, isAdmin, productController.getAllForAdminWithPagination);
router.post("/", upload.any(), productController.create);
router.put("/:id", upload.any(), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);



// User
// router.get("/", productController.getAllForUser);
router.get("/", productController.getAllForUserWithPagination);
router.get("/:id", productController.getDetail);


module.exports = router;