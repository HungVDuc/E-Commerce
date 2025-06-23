const cartService = require("../services/cart.service");
const sendResponse = require("../utils/response");
const cartResource = require("../resources/cart.resource");

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    sendResponse(res, {
      result: cartResource(cart),
      message: "Lấy giỏ hàng thành công",
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productVariantId, quantity } = req.body;
    const cart = await cartService.removeFromCart(
      req.user._id,
      productVariantId
    );
    sendResponse(res, {
      result: cartResource(cart),
      message: " Đã thêm vào giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productVariantId } = req.params;
    const cart = await cartService.removeFromCart(
      req.user._id,
      productVariantId
    );
    sendResponse(res, {
      result: cartResource(cart),
      message: "Đã xoá sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    sendResponse(res, {
      result: cartResource(cart),
      message: "Đã xoá toàn bộ giỏ hàng",
    });
  } catch (error) {
    next(error);
  }
};

const cartController = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

module.exports = cartController;
