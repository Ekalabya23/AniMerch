const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const cheakoutController = require("../controller/cheackoutController");

router.get(
  "/:id",
  authController.protect,
  cheakoutController.getCheackoutSession
);

router.post(
  "/verify-payment",
  authController.protect,
  cheakoutController.verifyPayment
);

module.exports = router;
