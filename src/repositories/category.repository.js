const Category = require("../models/category.model");

const getAllCategories = async (includeDeleted = false) => {
  const filter = includeDeleted ? {} : { isDeleted: false };
  return Category.find(filter);
};

const getCategoryById = async (id) => {
  return Category.findById(id);
};

const getCategoryByName = async (name) => {
  return Category.findOne({ name });
};

const createCategory = async (data) => {
  return Category.create(data);
};

const updateCategory = async (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

const softDeleteCategory = async (id) => {
  return Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const categoryRepository = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategory,
  softDeleteCategory,
};

module.exports = categoryRepository;
