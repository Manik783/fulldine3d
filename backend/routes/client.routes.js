const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controllers");
const authMiddleware = require("../middleware/auth.middleware");
const adminController = require("../controllers/admin.controllers");
const { body } = require("express-validator");
const BlackListToken = require("../models/blackListToken.model");
// cleint login
router.post("/login", clientController.loginClient);

//add dish
router.post("/addDish", authMiddleware.clientAuth, clientController.addDish);

// get all dishes
router.get(
  "/dishes/:rest_id",
  authMiddleware.clientAuth,
  clientController.getDishList
);

//dish availability
router.put(
  "/availability/:rest_id/:item_id/:availability",
  authMiddleware.clientAuth,
  clientController.updateDishAvailability
);

// get restaurant info
router.get(
  "/info/:rest_id",
  authMiddleware.clientAuth,
  clientController.getinfo
);

// add dish
router.post("/add_dish", authMiddleware.clientAuth, clientController.addDish);

// client logout
router.post("/logout", authMiddleware.clientAuth, async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await BlackListToken.create({ token });

  res.status(200).json({ message: "Client logged out" });
});

// get restaurant info
router.get(
  "/restaurantinfo/:rest_id",
  authMiddleware.clientAuth,
  adminController.getRestaurantInfo
);

// Update restaurant info
router.put(
  "/update_restaurant/:rest_id",
  authMiddleware.clientAuth,
  adminController.updateRestaurant
);

// PUT endpoint to update a dish
router.put(
  "/update_dish/:rest_id/:item_id",
  authMiddleware.clientAuth,
  adminController.updateDish
);

module.exports = router;
