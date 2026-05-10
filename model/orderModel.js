const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User must be specified"],
  },

  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product must be specified"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity must be specified"],
        min: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  payment: {
    type: String,
    enum: ["pre-paid", "post-paid"],
    required: [true, "Payment must be specified"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Price must be specified"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  address: {
    type: mongoose.Schema.ObjectId,
    ref: "address",
    required: [true, "Product must be specified"],
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
