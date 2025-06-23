const AppError = require("../errors/app-error");

const ErrorTypes = {
  // Xác thực và phân quyền
  USER_NOT_FOUND: { message: "User not found", statusCode: 404 },
  EMAIL_ALREADY_EXISTS: { message: "Email already exists", statusCode: 400 },
  INVALID_PASSWORD: { message: "Invalid password", statusCode: 401 },
  UNAUTHORIZED: { message: "Unauthorized access", statusCode: 401 },
  INVALID_CREDENTIALS: { message: "Invalid email or password", statusCode: 401 },
  TOKEN_EXPIRED: { message: "Access token has expired. Please login again.", statusCode: 401 },
  INVALID_TOKEN: { message: "Invalid access token", statusCode: 401 },
  FORBIDDEN: { message: "You are not allowed to access this resource", statusCode: 403 },
  SERVER_ERROR: { message: "Something went wrong", statusCode: 500 },

  // Loại sản phẩm
  CATEGORY_NOT_FOUND: { message: "Category not found", statusCode: 404 },
  CATEGORY_CONFLICT: { message: "Category conflict", statusCode: 409},


  // Sản phẩm
  PRODUCT_NOT_FOUND: { message: "Product not found", statusCode: 404 },
  PRODUCT_CONFLICT: { message: "Product conflict", statusCode: 409},

  // Giỏ hàng
  CART_NOT_FOUND: { message: "Cart not found", statusCode: 404 },

  // Đơn hàng
  ORDER_BAD_REQUEST: { message: "Order must have at least one item", statusCode: 400 },
  ORDER_NOT_FOUND: { message: "Order not found", statusCode: 404 },


  // Thực thể của sản phẩm
  VARIANT_NOT_FOUND: { message: "Variant not found", statusCode: 404 },

};

module.exports = ErrorTypes;
