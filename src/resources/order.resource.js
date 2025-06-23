module.exports = (order) => ({
  id: order._id,
  userId: order.userId,
  items: order.items.map((item) => ({
    productVariantId: item.productVariantId._id,
    name: item.productVariantId.name || undefined,
    quantity: item.quantity,
    price: item.price,
  })),
  totalAmount: order.totalAmount,
  status: order.status,
  shippingAddress: order.shippingAddress,
  paymentMethod: order.paymentMethod,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});