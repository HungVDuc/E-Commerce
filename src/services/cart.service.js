const cartRepository = require("../repositories/cart.repository");
const Errors = require("../errors/error-factory");

const getCart = async (userId) => {
  let cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    cart = await cartRepository.createCart(userId);
  }
  return cart;
};

const addToCart = async (userId, productVariantId, quantity) => {
  let cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    cart = await cartRepository.createCart(userId);
  }

  const existingItem = cart.items.find(
    (item) => item.productVariantId.toString() === productVariantId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productVariantId, quantity });
  }

  return await cartRepository.updateCart(cart._id, { items: cart.items });
};

const removeFromCart = async (userId, productVariantId) => {
  let cart = await cartRepository.findByUserId(userId);
  if (!cart) throw Errors.CART_NOT_FOUND();

  cart.items = cart.items.filter(
    (item) => item.productVariantId.toString() !== productVariantId
  );

  return await cartRepository.updateCart(cart._id, { items: cart.items });
};

const clearCart = async (userId) => {
  return await cartRepository.updateCart(userId, { items: [] });
};

const cartService = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

module.exports = cartService;
