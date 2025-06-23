const Image = require("../models/image.model");

const createManyImages = async (imagesData) => {
  return await Image.insertMany(imagesData);
};

const findByProductAndVariantIds = async (productIds, variantIds) => {
  return Image.find({
    productId: { $in: productIds },
    productVariantId: { $in: variantIds },
  }).lean();
};

const findByVariantIds = async (variantIds) => {
  return Image.find({
    productVariantId: { $in: variantIds },
  }).lean();
};

const softDelete = async (productId) => {
  return Image.updateMany({productId}, { isDeleted: true });
}

const exists = async (filter) => {
  return await Image.exists(filter);
};

const createImage = async (data) => {
  return await Image.create(data);
};  

const find = async (filter) => {
  return await Image.find(filter);
};


const imageRepository = {
  createManyImages,
  findByProductAndVariantIds,
  findByVariantIds,
  softDelete,
  exists,
  createImage,
  find,
};

module.exports = imageRepository;
