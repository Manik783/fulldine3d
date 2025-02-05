const RestaurantModel = require("../models/restaurant.model");
const DishModel = require("../models/dish.model");
//get restaurant info
module.exports.getRestaurantInfo = async (req, res, next) => {
  const { rest_id } = req.params;
  const restaurant = await RestaurantModel.findOne({ rest_id: rest_id });
  res.json({ restaurant });
};

// get restaurant's dish list
module.exports.getDishList = async (req, res, next) => {
  const { rest_id } = req.params;
  const dishes = await DishModel.getDishesByRestaurant(rest_id);
  res.json({ dishes });
};

module.exports.getDishCDN = async (req, res, next) => {
  const { rest_id, item_id } = req.params;
  const dish = await DishModel.findOne({ rest_id, item_id });
  if (!dish) {
    return res.status(404).json({ message: "No dish found with this ID" });
  }
  res.json({ dish });
  // cloud link to change to CDN in frontend
};
