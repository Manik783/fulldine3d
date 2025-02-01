const RestaurantModel = require('../models/restaurant.model');

//get restaurant info
module.exports.getRestaurantInfo = async (req, res, next) => {
    const { rest_id } = req.params;
    const restaurant = await RestaurantModel.findOne({ rest_id: rest_id });
    res.json({ restaurant });
  };
  
// get restaurant's dish list
module.exports.getDishList = async (req, res, next) => {
  const { res_id } = req.params;
  const dishes = await DishModel.getDishesByRestaurant(res_id);
  res.json({ dishes });
};
