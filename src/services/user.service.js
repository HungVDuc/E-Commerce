const userRepository = require("../repositories/user.repository");
const Errors = require("../errors/error-factory");

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) throw Errors.USER_NOT_FOUND();

  return user;
};

const userService = {
  getProfile,
};

module.exports = userService;
