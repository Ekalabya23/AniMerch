const Cart = require("../model/cartModel");
const catchAsync = require("../utils/catchAsync");

exports.createCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    return res.status(400).json({ message: "Cart already exists" });
  }

  cart = await Cart.create({ user: req.user.id, items: [] });

  res.status(201).json({
    status: "success",
    data: { cart },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { product, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: product, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: product, quantity });
    }

    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: { cart },
  });
});

exports.getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  console.log(userId);

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  console.log(cart);
  if (!cart) {
    return res.status(404).json({
      status: "fail",
      message: "No cart found for this user",
    });
  }

  res.status(200).json({
    status: "success",
    data: { cart },
  });
});

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => {
    if (!item.product) return true;
    const id = item.product._id?.toString() || item.product.toString();
    return id !== productId;
  });

  await cart.save();

  res.status(200).json({ status: "success", cart });
};

exports.removeCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ status: "fail", message: "Cart not found" });
  }

  cart.items = [];
  await cart.save();
});
