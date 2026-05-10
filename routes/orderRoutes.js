const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const orderController = require("../controller/orderController");

router.use(authController.protect);

router.post("", orderController.setUserId, orderController.createOrder);
router.get("/all", orderController.getAllOrder);

router
  .route("/:id")
  .delete(orderController.deleteOrder)
  .patch(orderController.updateOrder)
  .get(orderController.getOneOrder);

module.exports = router;
