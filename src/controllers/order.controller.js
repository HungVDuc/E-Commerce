const orderService = require("../services/order.service");
const sendResponse = require("../utils/response");
const orderResource = require("../resources/order.resource");

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder({
      userId: req.user.userId,
      ...req.body,
    });
    sendResponse(res, {
      result: orderResource(order),
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    sendResponse(res, {
      result: orderResource(order),
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();

    sendResponse(res, {
      result: orders.map((order) => {
        return orderResource(order);
      }),
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    sendResponse(res, {
      result: orderResource(order),
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    sendResponse(res, {
      result: orderResource(order),
      message: "Order deleted",
    });
  } catch (error) {
    next(error);
  }
};

const orderController = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};

module.exports = orderController;
