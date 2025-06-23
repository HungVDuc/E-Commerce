const ProductVariant = require("../models/productVariant.model");
require("../models/color.model");
require("../models/size.model");

const createManyVariants = async (variants) => {
  return ProductVariant.insertMany(variants);
};

const findByProductIds = async (productIds, includeDeleted = false) => {
  const filter = {
    productId: { $in: productIds },
    ...(includeDeleted ? {} : { isDeleted: false }),
  };
  return ProductVariant.find(filter)
    .populate("colorId")
    .populate("sizeId")
    .lean();
};

const findByProductId = async (productIds, includeDeleted = false) => {
  const filter = {
    productId: productIds,
    ...(includeDeleted ? {} : { isDeleted: false }),
  };
  return ProductVariant.find(filter)
    .populate("colorId")
    .populate("sizeId")
    .sort({ createdAt: 1 })
    .lean();
};

const updateById = async (id, data) => {
  return ProductVariant.findByIdAndUpdate(id, data, { new: true });
};

const softDelete = async (productId) => {
  return ProductVariant.updateMany({ productId }, { isDeleted: true });
};

const findByProductIdAndColorSize = async (productId, colorId, sizeId) => {
  return await ProductVariant.findOne({
    productId,
    colorId,
    sizeId,
    isDeleted: false,
  });
};

const findByIds = async (variantIds, isDeleted = false) => {
  return await ProductVariant.find({
    _id: { $in: variantIds },
    isDeleted,
  });
};

const productVariantRepository = {
  createManyVariants,
  findByProductIds,
  findByProductId,
  updateById,
  softDelete,
  findByProductIdAndColorSize,
  findByIds,
};

module.exports = productVariantRepository;
