const Cart = require("../models/cart.model");

const findByUserId = async (userId) => {
  return await Cart.findOne({ userId, isDeleted: false }).populate({
    path: "items.productVariantId",
    populate: [
      { path: "colorId" },
      { path: "sizeId" },
      { path: "productId", populate: { path: "categoryId" } },
    ],
  });
};

const createCart = async (userId) => {
  return await Cart.create({ userId, items: [] });
};

const updateCart = async (cartId, updateData) => {
  return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
};

const deleteCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { userId },
    { isDeleted: true },
    { new: true }
  );
};

const cartRepository = {
  findByUserId,
  createCart,
  updateCart,
  deleteCart,
};

module.exports = cartRepository;
