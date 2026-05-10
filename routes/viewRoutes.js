const express = require("express");
const path = require("path");
const viewController = require("../controller/viewController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.isLogedin);

router.get("/", viewController.getOverview);
router.get("/product/:slug", viewController.getProductDetails);
router.get("/anime/:animeName", viewController.getProductAnime);
router.get("/category/:categoryName", viewController.getProductCatgory);

router.get("/type/:typeName", viewController.getProductType);
router.get("/me", viewController.getProfile);
router.get("/me/orders", viewController.getMyOrders);

router.get("/myCarts", viewController.getMyCarts);

router.get("/login", viewController.getLogin);
router.get("/signup", viewController.getSignUp);
router.get("/payment-success", viewController.getPaymentSuceess);

module.exports = router;
