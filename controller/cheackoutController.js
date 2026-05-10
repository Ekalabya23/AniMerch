const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const AppError = require("../utils/appError");

exports.getCheackoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the cart
  const cart = await Cart.findById(req.params.id).populate("items.product");
  if (!cart) next(new AppError("Cart does not found !", 404));

  const totalPrice = cart.items.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.discountedPrice,
    0
  );

  const shipping = 99;
  const shortId = cart._id.toString().slice(-6);
  const shortTime = Date.now().toString().slice(-5);

  const receipt = `rcpt_${shortId}_${shortTime}`;

  const options = {
    amount: (totalPrice + shipping) * 100,
    currency: "INR",
    receipt,
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    status: "Success",
    order,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    cartId,
    addressId,
    totalPrice,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const cart = await Cart.findById(cartId).populate("items.product");

    const order = await Order.create({
      user: req.user._id,
      address: addressId,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      status: "pending",
      payment: "pre-paid",
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: "Success",
      order,
    });
  }
});
