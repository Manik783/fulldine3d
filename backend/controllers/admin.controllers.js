const AdminModel = require("../models/admin.model");
const blackListTokenModel = require("../models/blackListToken.model");
const AdminService = require("../services/admin.service");
const { validationResult } = require("express-validator");
const DishService = require("../services/dish.service");
const DishModel = require("../models/dish.model");
const RestaurantService = require("../services/restaurant.service");
const RestaurantModel = require("../models/restaurant.model");

module.exports.registerAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;

  const ifAdminAlreadyExist = await AdminModel.findOne({ email });

  if (ifAdminAlreadyExist) {
    return res.status(400).json({ message: "Admin already exist" });
  }

  const hashedPassword = await AdminModel.hashPassword(password);

  const admin = await AdminService.createAdmin({
    fullName: {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    },

    email: email,
    password: hashedPassword,
  });

  //const token = captain.generateAuthToken();

  res.status(201).json({ admin });
};
module.exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await admin.isValidPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = await admin.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ message: "Login successful", admin, token });
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
    res_id,
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

// get restaurant's dish list
module.exports.getDishList = async (req, res, next) => {
  const { res_id } = req.params;
  const dishes = await DishModel.getDishesByRestaurant(res_id);
  res.json({ dishes });
};

//get restaurants list
module.exports.getRestaurants = async (req, res, next) => {
  const restaurantsList = await RestaurantModel.getAllRestaurantIds();
  res.json({ restaurantsList });
};

module.exports.getProfile = async (req, res, next) => {
  const admin = req.admin;
  res.status(200).json({ admin });
};

module.exports.addClient = async (req, res, next) => {
  const {
    //rest_id,
    name,
    password,
    email,
    description,
    phone_number,
    rating,
    images,
    reviewers,
  } = req.body;
  const hashedPassword = await RestaurantModel.hashPassword(password);
  const restaurant = await RestaurantService.createRestaurant({
    //rest_id,
    name,
    password: hashedPassword,
    email,
    description,
    phone_number,
    rating,
    images,
    reviewers,
  });

  res.status(201).json({ restaurant });
};

//get restaurant info
module.exports.getRestaurantInfo = async (req, res, next) => {
  const { rest_id } = req.params;
  const restaurant = await RestaurantModel.findOne({ rest_id: rest_id });
  res.json({ restaurant });
};

module.exports.updateDish = async (req, res, next) => {
  const { item_id, rest_id } = req.params;
  const {
    price,
    serves,
    isVeg,
    name,
    description,
    category1,
    category2,
    category3,
    image,
    glb_url,
    usdz_url,
  } = req.body;

  try {
    // Find the dish by its item_id and update it
    const updatedDish = await DishModel.findOneAndUpdate(
      { rest_id, item_id }, // Find dish by `item_id`
      {
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
      },
      { new: true } // Return the updated document
    );

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.status(200).json({
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ error: "Failed to update the dish" });
  }
};

module.exports.updateRestaurant = async (req, res, next) => {
  const { rest_id } = req.params; // Extract rest_id from params
  const { email, name, description, phone_number, rating, images, reviewers } =
    req.body;

  try {
    // Find the restaurant by `rest_id` and update it
    const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
      { rest_id }, // Find restaurant by `rest_id`
      {
        email,
        name,
        description,
        phone_number,
        rating,
        images,
        reviewers,
      },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Failed to update the restaurant" });
  }
};

module.exports.updateDishVisibility3D = async (req, res, next) => {
  const { item_id, rest_id, visibility } = req.params;

  try {
    // Find the dish by its item_id and update its visibility
    const updatedDish = await DishModel.findOneAndUpdate(
      { rest_id, item_id }, // Find dish by `item_id`
      { visibility_3D: visibility }, // Update the visibility field
      { new: true } // Return the updated document
    );

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.status(200).json({
      message: "Dish visibility updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    console.error("Error updating dish visibility:", error);
    res.status(500).json({ error: "Failed to update the dish visibility" });
  }
};
