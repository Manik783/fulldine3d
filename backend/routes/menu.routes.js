const express = require("express");
const router = express.Router();
const DishModel = require("../models/dish.model");
const RestaurantModel = require("../models/restaurant.model");
const menuController = require("../controllers/menu.controllers");

// get restaurant's dishes
router.get("/dishes/:rest_id", async (req, res, next) => {
  const rest_id = req.params.rest_id;
  const dishes = await DishModel.find({ rest_id: rest_id });
  if (dishes.length == 0) {
    return res
      .status(404)
      .json({ message: "No dishes found for this restaurant" });
  }
  res.status(200).json({ dishes });
});

// to be revised later
router.post("/addreview", async (req, res, next) => {
  const { rest_id, customer_name, rating, review } = req.body;
  const restaurant = await RestaurantModel.findByIdAndUpdate(
    { rest_id: rest_id },
    { $push: { reviews: { customer_name, rating, review } } },
    { new: true }
  );

  if (!restaurant) {
    return res
      .status(404)
      .json({ message: "No restaurant found with this ID" });
  }

  res.status(200).json({ restaurant });
});

//restaurant information
router.get("/restaurantinfo/:rest_id", menuController.getRestaurantInfo);


// get dish cdn
router.get("/dishcdn/:rest_id/:item_id", menuController.getDishCDN);

module.exports = router;
