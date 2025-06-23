const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("../src/middlewares/error.middleware");

dotenv.config();

const app = express();

app.use(morgan("dev"));
// Cho phép truy cập ảnh tĩnh
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Middleware đọc cookie
app.use(cookieParser());

// Auth Router
const authRoute = require("./routes/auth.route");
app.use("/api/v1/auth", authRoute);

// User Router
const userRoute = require("./routes/user.route");
app.use("/api/v1/users", userRoute);

// Category Router
const categoryRoute = require("./routes/category.route");
app.use("/api/v1/categories", categoryRoute);

// Product Router
const productRoute = require("./routes/product.route");
app.use("/api/v1/products", productRoute);

// Cart Router
const cartRoute = require("./routes/cart.route");
app.use("/api/v1/carts", cartRoute);

// Order Router
const orderRouter = require("./routes/order.route");
app.use("/api/v1/orders", orderRouter);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(errorHandler);

module.exports = app;
