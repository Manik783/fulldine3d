const AdminModel = require("../models/admin.model");
const blackListTokenModel = require("../models/blackListToken.model");
const AdminService = require("../services/admin.service");
const { validationResult } = require("express-validator");
const DishService = require("../services/dish.service");
const DishModel = require("../models/dish.model");
const RestaurantModel = require("../models/restaurant.model");
const bcrypt = require("bcryptjs");

// client login
module.exports.loginClient = async (req, res, next) => {
  const { email, password } = req.body;

  const client = await RestaurantModel.findOne({ email });

  if (!client) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await client.isValidPassword(password);
  //normal bug password may not be hashed properly
  console.log(isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = await client.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ message: "Login successful", client, token });
};

// add dish
module.exports.addDish = async (req, res, next) => {
  const {
    rest_id,
    name,
    price,
    serves,
    isVeg,
    description,
    category1,
    category2,
    category3,
    image,
    glb_url,
    usdz_url,
  } = req.body;

  const dish = await DishService.createProduct({
    rest_id,
    name,
    price,
    serves,
    isVeg,
    description,
    category1,
    category2,
    category3,
    image,
    glb_url,
    usdz_url,
  });

  res.status(201).json({ dish });
};

// get restaurant's dish list
// need to change logic little bit
module.exports.getDishList = async (req, res, next) => {
  const rest_id = req.params.rest_id;
  const dishes = await DishModel.getDishesByRestaurant(rest_id);
  res.json({ dishes });
};

//get info
//get restaurant info
module.exports.getInfo = async (req, res, next) => {
  const { rest_id } = req.params;
  const restaurant = await RestaurantModel.findOne({ rest_id: rest_id });
  res.json({ restaurant });
};

// get restaurant's details
module.exports.getinfo = async (req, res, next) => {
  const rest_id = req.params.rest_id;
  const restaurant = await RestaurantModel.findById({ rest_id: rest_id });
  if (!restaurant) {
    return res
      .status(404)
      .json({ message: "No restaurant found with this ID" });
  }
  res.status(200).json({ restaurant });
};

// need a patch api to change the availability status of the dish

module.exports.updateDishAvailability = async (req, res, next) => {
  const { rest_id, item_id, availability } = req.params;
  const dish = await DishModel.findOneAndUpdate(
    { rest_id, item_id },
    { $set: { availability: availability } },
    { new: true }
  );

  if (!dish) {
    return res.status(404).json({ message: "No dish found with this ID" });
  }

  res.status(200).json({ dish });
};

module.exports.addDish = async (req, res, next) => {
  const {
    rest_id,
    item_id,
    name,
    price,
    serves,
    isVeg,
    description,
    category1,
    category2,
    category3,
    image,
    glb_url,
    usdz_url,
  } = req.body;

  const dish = await DishService.createProduct({
    rest_id,
    item_id,
    name,
    price,
    serves,
    isVeg,
    description,
    category1,
    category2,
    category3,
    image,
    glb_url,
    usdz_url,
  });

  res.status(201).json({ dish });
};
