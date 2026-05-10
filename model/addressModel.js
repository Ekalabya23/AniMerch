// eslint ignore ?
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User must be specified"],
  },
  city: {
    type: String,
    required: [true, "City must be specified"],
  },
  street: {
    type: String,
  },
  houseNumber: {
    type: String,
  },
  pinCode: {
    type: Number,
    required: [true, "Pin code must be specified"],
  },
  country: {
    type: String,
    required: [true, "Country must be specified"],
  },
  state: {
    type: String,
    required: [true, "State must be specified"],
  },
  district: {
    type: String,
    required: [true, "District must be specified"],
  },
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
