const categoryService = require("../services/category.service");
const sendResponse = require("../utils/response");

const listForAdmin = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategoiresForAdmin();
    sendResponse(res, {
      result: categories,
    });
  } catch (error) {
    next(error);
  }
};

const listForUser = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategoiresForUser();
    sendResponse(res, {
      result: categories,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    sendResponse(res, {
      result: category,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      result: category,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    sendResponse(res, {
      result: category,
    });
  } catch (error) {
    next(error);
  }
};

const categoryController = {
  listForAdmin,
  listForUser,
  create,
  update,
  remove,
};

module.exports = categoryController;
