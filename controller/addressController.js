const Address = require("../model/addressModel");
const factoryHandler = require("./factoryHandelr");

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

exports.AddAdress = factoryHandler.createOne(Address);
exports.deleteAddress = factoryHandler.deleteOne(Address);
exports.updateAddress = factoryHandler.updateOne(Address);
