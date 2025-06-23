const categoryRepository = require("../repositories/category.repository");
const Errors = require("../errors/error-factory");

const listCategoiresForAdmin = async () => {
  return categoryRepository.getAllCategories(true);
};

const listCategoiresForUser = async () => {
  return categoryRepository.getAllCategories(false);
};

const createCategory = async (data) => {
  const existing = await categoryRepository.getCategoryByName(data.name);
  if (existing) throw Errors.CATEGORY_CONFLICT();
  return categoryRepository.createCategory(data);
};

const updateCategory = async (id, data) => {
  const existing = await categoryRepository.getCategoryById(id);
  if (!existing) throw Errors.CATEGORY_NOT_FOUND();
  return categoryRepository.updateCategory(id, data);
};

const deleteCategory = async (id) => {
  const existing = await categoryRepository.getCategoryById(id);
  if (!existing) throw Errors.CATEGORY_NOT_FOUND();
  return categoryRepository.softDeleteCategory(id);
};

const categoryService = {
  listCategoiresForAdmin,
  listCategoiresForUser,
  createCategory,
  updateCategory,
  deleteCategory,
};

module.exports = categoryService;
