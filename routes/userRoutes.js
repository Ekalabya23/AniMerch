const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const addressController = require("../controller/addressController");
const cartController = require("../controller/cartController");
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.get("/logout", authController.logout);

router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/cart").post(cartController.addToCart);

router.delete("/cart", cartController.removeCart);

router.route("/cart/all").get(cartController.getCart);

router.route("/cart/:id").delete(cartController.removeFromCart);

router.route("/changePassword").patch(authController.updatePassword);

router.route("/me").get(userController.getMe, userController.getAUser);

router.route("/updateMe").patch(userController.updateMe);
router
  .route("/updateMyPhoto")
  .patch(userController.uploadUserPhoto, userController.updateUserProfile);

router.route("/deleteMe").delete(userController.deleteMe);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUser)
  .post(authController.restrictTo("admin"), userController.addAUser);

router
  .route("/:id")
  .get(userController.getAUser)
  .patch(userController.updateAUser)
  .delete(
    authController.restrictTo("admin", "dev"),
    userController.removeAUser
  );

router
  .route("/address")
  .post(addressController.setUserId, addressController.AddAdress);
router
  .route("/address/:id")
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
