const express = require("express");

const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");

const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(reviewController.setProductIdAndUserId, reviewController.postReview);

router
  .route("/:id")
  .get(reviewController.getAReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
