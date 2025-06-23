const Product = require("../models/product.model");

const create = async (data) => {
  return Product.create(data);
};

const findById = async (id) => Product.findById(id);

// Không phân trang (xoá)
const findAll = async (includeDeleted = false) => {
  const filter = includeDeleted ? {} : { isDeleted: false };
  return Product.find(filter).lean();
};

const findByName = async (name) => {
  return Product.findOne({ name });
};

const findByNameExcludingId = async (name, excludedId) => {
  return Product.findOne({
    name,
    _id: { $ne: excludedId },
  });
};

const getAllWithPagination = async (page, limit, includeDeleted = false) => {
  const filter = includeDeleted ? {} : { isDeleted: false };

  const skip = (page - 1) * limit;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return { total, products };
};

const getById = async (productId, includeDeleted = false) => {
  return Product.findOne({
    _id: productId,
    ...(includeDeleted ? {} : { isDeleted: false }),
  }).lean();
};

const updateById = async (productId, data) => {
  return Product.findByIdAndUpdate(productId, data, { new: true });
};

const softDelete = async (productId) => {
  return Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true }
  );
};

const productRepository = {
  findByName,
  findAll,
  findById,
  create,
  getAllWithPagination,
  getById,
  updateById,
  softDelete,
  findByNameExcludingId,
};

module.exports = productRepository;
