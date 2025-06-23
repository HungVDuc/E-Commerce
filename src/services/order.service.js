const orderRepository = require("../repositories/order.repository");
const productVariantRepository = require("../repositories/productVariant.repository");
const Errors = require("../errors/error-factory");

const createOrder = async ({
  userId,
  items,
  shippingAddress,
  paymentMethod,
}) => {
  if (!items || items.length === 0) throw Errors.ORDER_BAD_REQUEST();

  // Lấy thông tin tất cả variantId để truy vấn 1 lần
  const variantIds = items.map((item) => item.productVariantId);

  const variants = await productVariantRepository.findByIds(variantIds, false);

  if (variants.length !== items.length) {
    throw Errors.VARIANT_NOT_FOUND();
  }

  // Tính tổng tiền và chuẩn hoá danh sách items
  const orderItems = items.map((item) => {
    const variant = variants.find(
      (v) => v._id.toString() === item.productVariantId
    );
    if (!variant) throw Errors.VARIANT_NOT_FOUND();

    return {
      productVariantId: variant._id,
      quantity: item.quantity,
      price: variant.price, // lấy từ DB
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return await orderRepository.create({
    userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });
};

const getOrderById = async (id) => {
  const order = await orderRepository.findById(id);
  if (!order || order.isDeleted) throw Errors.ORDER_NOT_FOUND();
  return order;
};

const getAllOrders = async () => {
  return await orderRepository.findAll({ isDeleted: false });
};

const updateOrderStatus = async (id, status) => {
  const updated = await orderRepository.updateStatus(id, status);
  if (!updated) throw Errors.ORDER_NOT_FOUND();
  return updated;
};

const deleteOrder = async (id) => {
  return await orderRepository.softDelete(id);
};

const orderService = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};

module.exports = orderService;
