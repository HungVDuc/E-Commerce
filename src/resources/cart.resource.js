const cartResource = (cart) => {
  if (!cart) return null;

  return {
    id: cart._id,
    userId: cart.userId,
    items: cart.items.map((item) => ({
      id: item._id,
      quantity: item.quantity,
      productVariantId: item.productVariantId?._id,
      color: item.productVariantId?.colorId?.name,
      size: item.productVariantId?.sizeId?.name,
      price: item.productVariantId?.price,
      product: {
        id: item.productVariantId?.productId?._id,
        name: item.productVariantId?.productId?.name,
        basePrice: item.productVariantId?.productId?.basePrice,
        category: item.productVariantId?.productId?.categoryId?.name,
      },
    })),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

module.exports = cartResource;