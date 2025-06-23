const AppError = require("./app-error");
const ErrorTypes = require("../constants/error-types");

const errorFactory = {};

for (const [key, value] of Object.entries(ErrorTypes)) {
  errorFactory[key] = () => new AppError(value.message, value.statusCode);
}

module.exports = errorFactory;
