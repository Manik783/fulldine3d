const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/admin.controllers");
const BlackListToken = require("../models/blackListToken.model");
const DishModel = require("../models/dish.model");
const RestaurantModel = require("../models/restaurant.model");

// signup admin
router.post(
  "/admin_signup",
  authMiddleware.adminAuth,
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullName.firstName").notEmpty().withMessage("First Name is required"),
  ],
  adminController.registerAdmin
);

// login admin
router.post("/login", adminController.loginAdmin);

// add dish
router.post("/add_dish", authMiddleware.adminAuth, adminController.addDish);

// get restaurant's dish list
router.get(
  "/dish_list/:res_id",
  //authMiddleware.adminAuth,
  adminController.getDishList
);

// get restaurants lists
router.get(
  "/restaurants",
  authMiddleware.adminAuth,
  adminController.getRestaurants
);

//get admin profile
router.get("/profile", authMiddleware.adminAuth, adminController.getProfile);

// add restaurant
router.post("/addClient", authMiddleware.adminAuth, adminController.addClient);

// get restaurant info
router.get(
  "/restaurantinfo/:rest_id",
  authMiddleware.adminAuth,
  adminController.getRestaurantInfo
);

// Update restaurant info
router.put(
  "/update_restaurant/:rest_id",
  authMiddleware.adminAuth,
  adminController.updateRestaurant
);

// PUT endpoint to update a dish
router.put(
  "/update_dish/:rest_id/:item_id",
  authMiddleware.adminAuth,
  adminController.updateDish
);

//dish visibility3D
router.put(
  "/visibility3D/:rest_id/:item_id/:visibility",
  authMiddleware.adminAuth,
  adminController.updateDishVisibility3D
);

//logout functionality
router.post("/logout", authMiddleware.adminAuth, async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await BlackListToken.create({ token });

  res.status(200).json({ message: "Admin logged out" });
});

module.exports = router;
