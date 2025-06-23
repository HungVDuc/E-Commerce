const Order = require("../models/order.model");

const create = async (data) => await Order.create(data);

const findById = async (id) =>
  await Order.findById(id).populate({
    path: "items.productVariantId",
    populate: ["colorId", "sizeId"],
  });

const findAll = async (filter = {}, options = {}) =>
  await Order.find(filter, null, options).populate({
    path: "items.productVariantId",
    populate: ["colorId", "sizeId"],
  });

const updateStatus = async (id, status) =>
  await Order.findByIdAndUpdate(id, { status }, { new: true });

const softDelete = async (id) =>
  await Order.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

const orderRepository = {
  create,
  findById,
  findAll,
  updateStatus,
  softDelete,
};

module.exports = orderRepository;
