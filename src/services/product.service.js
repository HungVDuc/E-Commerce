const imageService = require("./image.service");
const Errors = require("../errors/error-factory");
const productRepository = require("../repositories/product.repository");
const productVariantRepository = require("../repositories/productVariant.repository");
const imageRepository = require("../repositories/image.repository");
const saveFilesFromBuffer = require("../utils/saveFilesFromBuffer");

const createProduct = async ({
  name,
  description,
  basePrice,
  categoryId,
  variants,
  files,
}) => {
  // Kiểm tra trùng tên
  const existing = await productRepository.findByName(name);
  if (existing) throw Errors.PRODUCT_CONFLICT();

  // 1. Tạo sản phẩm
  const product = await productRepository.create({
    name,
    description,
    basePrice,
    categoryId,
  });

  // 2. Tạo các biến thể
  const createdVariants = await productVariantRepository.createManyVariants(
    variants.map((variant) => ({
      productId: product._id,
      colorId: variant.colorId,
      sizeId: variant.sizeId,
      quantity: variant.quantity,
      price: variant.price,
    }))
  );

  // 3. Lưu ảnh
  if (files && files.length > 0) {
    const imagesWithVariants = files.map((file) => {
      const index = file.fieldname.split("-")[1];
      const variant = createdVariants[index];
      return {
        file,
        productId: product._id,
        productVariantId: variant?._id,
      };
    });

    const savedFiles = saveFilesFromBuffer(files);
    await imageService.saveUploadedImages(imagesWithVariants);
  }

  const plainProduct = product.toObject ? product.toObject() : product; // Chuyển từ document của Mongoose sang Object

  const productWithVariants = {
    ...plainProduct,
    variants: createdVariants,
  };

  return productWithVariants;
};

const getAllProductsWithPagination = async (
  page,
  limit,
  includeDeleted = false
) => {
  const { total, products } = await productRepository.getAllWithPagination(
    page,
    limit,
    includeDeleted
  );
  const productIds = products.map((p) => p._id);

  const variants = await productVariantRepository.findByProductIds(
    productIds,
    includeDeleted
  );
  const variantIds = variants.map((v) => v._id);

  const images = await imageRepository.findByProductAndVariantIds(
    productIds,
    variantIds
  );

  const variantsWithImages = variants.map((variant) => ({
    ...variant,
    color: variant.colorId,
    size: variant.sizeId,
    image:
      images.find(
        (img) => img.productVariantId?.toString() === variant._id.toString()
      ) || null,
  }));

  const productsWithVariants = products.map((product) => ({
    ...product,
    variants: variantsWithImages.filter(
      (v) => v.productId.toString() === product._id.toString()
    ),
  }));

  return {
    products: productsWithVariants,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const getProductById = async (productId, includeDeleted = false) => {
  const product = await productRepository.getById(productId, includeDeleted);

  if (!product) throw Errors.PRODUCT_NOT_FOUND();

  const variants = await productVariantRepository.findByProductId(
    productId,
    includeDeleted
  );

  const variantIds = variants.map((v) => v._id);
  const images = await imageRepository.findByVariantIds(variantIds);

  const variantsWithImage = variants.map((v) => ({
    ...v,
    image:
      images.find((img) => String(img.productVariantId) === String(v._id)) ||
      null,
  }));

  return {
    ...product,
    variants: variantsWithImage,
  };
};

const deleteProduct = async (productId) => {
  const product = await productRepository.findById(productId);

  if (!product || product.isDeleted) {
    throw Errors.PRODUCT_NOT_FOUND();
  }

  const deletedProduct = await productRepository.softDelete(productId);
  await productVariantRepository.softDelete(productId);
  await imageRepository.softDelete(productId);

  return deletedProduct;
};

const updateProduct = async (productId, data, files) => {
  const { name, description, basePrice, categoryId, variants } = data;

  const existing = await productRepository.findByNameExcludingId(
    name,
    productId
  );
  if (existing) throw Errors.PRODUCT_CONFLICT();

  const updatedProduct = await productRepository.updateById(productId, {
    name,
    description,
    basePrice,
    categoryId,
  });

  const currentVariants = await productVariantRepository.findByProductId(
    productId,
    false
  );

  // currentVariants: các variants trong database (cũ)
  // variants: các variants được gửi tới (mới)

  for (let i = 0; i < variants.length; i++) {
    const incoming = variants[i];
    const existing = currentVariants[i];

    if (!existing) break; // Tránh out-of-bounds nếu client truyền ít hơn

    await productVariantRepository.updateById(existing._id, {
      colorId: incoming.colorId,
      sizeId: incoming.sizeId,
      quantity: incoming.quantity,
      price: incoming.price,
    });
  }

  const imagesWithVariants = await Promise.all(
    files.map(async (file) => {
      const index = file.fieldname.split("-")[1];
      const variant = variants[index];

      const variantWithId =
        await productVariantRepository.findByProductIdAndColorSize(
          productId,
          variant.colorId,
          variant.sizeId
        );

      return {
        file,
        productId,
        productVariantId: variantWithId?._id,
      };
    })
  );

  await imageService.updateImagesByProductId(imagesWithVariants);

  return updatedProduct;
};

const productService = {
  createProduct,
  getAllProductsWithPagination,
  getProductById,
  updateProduct,
  deleteProduct,
};

module.exports = productService;
