const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dishSchema = new mongoose.Schema({
  rest_id: {
    type: Number,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  serves: {
    type: Number,
    required: true,
  },
  isVeg: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category1: {
    type: String,
  },
  category2: {
    type: String,
  },
  category3: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  glb_url: {
    type: String,
    //required: true,
    //unique: true,
  },
  usdz_url: {
    type: String,
    //required: true,
    //unique: true,
  },
  viewcount: {
    type: Number,
    default: 0,
  },
  visibility_3D: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});
// Static method to get all dishes for a particular restaurant
dishSchema.statics.getDishesByRestaurant = async function (rest_id) {
  try {
    return await this.find({ rest_id });
  } catch (error) {
    throw new Error(
      "Error fetching dishes for the given restaurant ID: " + error.message
    );
  }
};

// Static method to get all unique restaurant IDs
dishSchema.statics.getAllRestaurantIds = async function () {
  try {
    return await DishModel.distinct(rest_id);
  } catch (error) {
    throw new Error("Error fetching restaurant IDs: " + error.message);
  }
};
dishSchema.statics.incrementViewCount = async function (rest_id, item_id) {
  try {
    const updatedProduct = await this.findOneAndUpdate(
      { item_id, rest_id },
      { $inc: { viewCount: 1 } }, // Increment viewCount by 1
      { new: true } // Return the updated document
    );
    return updatedProduct;
  } catch (error) {
    throw new Error("Error incrementing view count: " + error.message);
  }
};

const DishModel = mongoose.model("Dish", dishSchema);

module.exports = DishModel;
