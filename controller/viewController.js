const Product = require("../model/productModel");
const User = require("../model/userModel");
const Carts = require("../model/cartModel");
const Order = require("../model/orderModel");
const Address = require("../model/addressModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  let products = await Product.find().sort({ avgRating: -1 }).limit(8);
  let newArrivals = await Product.find().sort({ releaseDate: -1 }).limit(10);
  res.status(200).render("overview", {
    title: "Higest Rated Product",
    products,
    newArrivals,
  });
});

exports.getProductDetails = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "reviews"
  );

  res.status(200).render("product", {
    title: product.title,
    product,
  });
});

exports.getProductAnime = catchAsync(async (req, res, next) => {
  const products = await Product.find({ anime: req.params.animeName });

  res.status(200).render("productListGnere", {
    title: req.params.animeName,
    products,
  });
});

exports.getProductCatgory = catchAsync(async (req, res, next) => {
  const products = await Product.find({ category: req.params.categoryName });

  res.status(200).render("productListCatagory", {
    title: req.params.categoryName,
    products,
  });
});

exports.getProductType = catchAsync(async (req, res, next) => {
  const products = await Product.find({ types: req.params.typeName });

  res.status(200).render("productListType", {
    title: req.params.typeName,
    products,
  });
});

exports.getLogin = (req, res, next) => {
  res.status(200).render("login", {
    title: "Log In Page",
  });
};

exports.getSignUp = (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign Up Page",
  });
};

exports.getProfile = catchAsync(async (req, res, next) => {
  const usersDetail = await User.findById(req.user.id);
  const addresses = await Address.find({ user: req.user.id });

  console.log(usersDetail);
  console.log(addresses);
  res.status(200).render("myProfile", {
    title: "My Profile",
    addresses,
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "products.product"
  );
  console.log(orders);
  res.status(200).render("myOrder", {
    title: "My Order",
    orders,
  });
});

exports.getMyCarts = catchAsync(async (req, res, next) => {
  const cart = await Carts.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  const addresses = await Address.find({ user: req.user.id });

  const totalPrice = cart.items.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.discountedPrice,
    0
  );
  console.log(cart);

  const shipping = 99;
  res.status(200).render("carts", {
    title: "My Carts",
    cart,
    totalPrice,
    shipping,
    addresses,
  });
});

exports.getPaymentSuceess = catchAsync(async (req, res, next) => {
  res.status(200).render("paySucess"),
    {
      title: "Success",
    };
});
