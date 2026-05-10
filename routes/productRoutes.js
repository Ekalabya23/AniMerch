const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const authController = require("../controller/authController");
const reviewRouter = require("../routes/reviewRoutes");

// router.param("id", productController.cheakID);

// POST - product/34667fg/review
// GET - product/335458gh/review
// GET - product/557548hj/review

router.use("/:productId/review", reviewRouter);

router
  .route("/top-5-products")
  .get(productController.aliasTopProduct, productController.getAllProduct);

router
  .route("/")
  .get(authController.protect, productController.getAllProduct)
  .post(productController.uploadProductImages, productController.AddAProduct);
router
  .route("/:id")
  .get(productController.getAProduct)
  .patch(productController.updateAProduct)
  .delete(productController.removeAProduct);

module.exports = router;
