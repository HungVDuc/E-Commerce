const userService = require("../services/user.service");
const userResource = require("../resources/user.resource");
const sendResponse = require("../utils/response");

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.userId);

    return sendResponse(res, {
      result: {
        user: userResource(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

const userController = {
  getProfile,
};

module.exports = userController;
