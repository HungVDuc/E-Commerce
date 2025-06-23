const User = require("../models/user.model");

const findById = async (id) => User.findById(id);

const findByEmail = async (email) => User.findOne({ email });

const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

const userRepository = {
  findById,
  findByEmail,
  createUser,
};

module.exports = userRepository;
