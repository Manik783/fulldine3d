const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CounterRestaurant = require("../models/counter.restaurant.model");
const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const restaurantSchema = new mongoose.Schema({
  rest_id: {
    type: Number,
    //required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: "string",
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  images: {
    type: [String],
    required: true,
  },
  reviewers: [reviewerSchema],
});

// **Pre-save Hook to Auto-Increment rest_id**
restaurantSchema.pre("save", async function (next) {
  if (!this.rest_id) {
    // Only generate rest_id if not provided
    const counter = await CounterRestaurant.findOneAndUpdate(
      { name: "restaurant_id" }, // Find the counter document
      { $inc: { sequence_value: 1 } }, // Increment the sequence value
      { new: true, upsert: true } // Return updated value, create if missing
    );
    this.rest_id = counter.sequence_value; // Assign new ID
  }
  next();
});

restaurantSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

restaurantSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

restaurantSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

restaurantSchema.statics.getAllRestaurantIds = async function () {
  try {
    return await Restaurants.distinct("rest_id");
  } catch (error) {
    throw new Error("Error fetching restaurant IDs: " + error.message);
  }
};

const Restaurants = mongoose.model("Restaurants", restaurantSchema);

module.exports = Restaurants;
