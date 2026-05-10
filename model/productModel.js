const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      unique: true,
      trim: true,
      maxlength: [200, "Name cannot be more than 40 characters"],
    },
    slug: String,
    avgRating: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Enter the discounted price"],
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: "Discounted price should be less then regular price",
      },
    },
    character: {
      type: String,
      trim: true,
    },
    anime: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Enter the category"],
    },
    genre: {
      type: String,
      required: [true, "Enter the genre"],
    },
    details: {
      type: [String],
      required: [true, "Enter the details"],
    },
    colors: {
      type: [String],
      required: [true, "Enter the colors"],
    },
    types: {
      type: String,
      required: [true, "Enter the type"],
    },
    stock: {
      type: Number,
      required: [true, "Enter the stock"],
    },
    releaseDate: {
      type: Date,
      default: Date.now(),
    },
    coverImage: {
      type: String,
      required: [true, "Enter the coverImage"],
    },
    images: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1, avgRating: -1 });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.virtual("reviews", {
  ref: "reviews",
  foreignField: "product",
  localField: "_id",
});

// Emabading document to Normal by id - Just for Learning
// productSchema.pre('save', async function() {
//   const reviewPromisses = this.review.map(async id => await User.findById(id))
//   this.review = await Promise.all(reviewPromisses)
//   next();
// })

// Populating using midleware - Just for Learning
// productSchema.pre(/^find/,  function(next) {
//   this.populate( {
//     path: 'reviews',
//     select: "-__v -passwordChangeAt"
//   })
// })

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
