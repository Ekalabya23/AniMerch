const Order = require("../model/orderModel");
const factoryHandelr = require("./factoryHandelr");

exports.setUserId = async (req, res, next) => {
  try {
    if (!req.body.user && req.user) {
      req.body.user = req.user.id;
    }
    console.log(req.body.user, req.body.product);
    next();
  } catch (err) {
    next(err);
  }
};

exports.createOrder = factoryHandelr.createOne(Order);
exports.deleteOrder = factoryHandelr.deleteOne(Order);
exports.getAllOrder = factoryHandelr.getAll(Order);
exports.updateOrder = factoryHandelr.updateOne(Order);
exports.getOneOrder = factoryHandelr.getOne(Order);
