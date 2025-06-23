const productService = require("../services/product.service");
const productResource = require("../resources/product.resource");
const sendResponse = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const { name, description, basePrice, categoryId, variants } = req.body;
    const files = req.files;

    const product = await productService.createProduct({
      name,
      description,
      basePrice,
      categoryId,
      variants: JSON.parse(variants),
      files,
    });

    sendResponse(res, {
      result: productResource(product),
    });
  } catch (error) {
    next(error);
  }
};

const getAllForAdminWithPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { products, total, totalPages } =
      await productService.getAllProductsWithPagination(page, limit, true);

    const data = products.map(productResource);

    sendResponse(res, {
      result: { data, pagination: { total, page, totalPages, limit } },
    });
  } catch (error) {
    next(error);
  }
};

const getAllForUserWithPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { products, total, totalPages } =
      await productService.getAllProductsWithPagination(page, limit, false);

    const data = products.map(productResource);

    sendResponse(res, {
      result: { data, pagination: { total, page, totalPages, limit } },
    });
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === "admin";

    const product = await productService.getProductById(id, isAdmin);

    sendResponse(res, {
      result: productResource(product),
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, basePrice, categoryId, variants } = req.body;
    const files = req.files;

    const updatedProduct = await productService.updateProduct(
      id,
      {
        name,
        description,
        basePrice,
        categoryId,
        variants: JSON.parse(variants),
      },
      files
    );

    return sendResponse(res, {
      result: productResource(updatedProduct),
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.deleteProduct(id);

    sendResponse(res, {
      result: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const productController = {
  create,
  getAllForAdminWithPagination,
  getAllForUserWithPagination,
  getDetail,
  updateProduct,
  deleteProduct,
};

module.exports = productController;
