const mongoose = require("mongoose");

const restaurantdishcounterSchema = new mongoose.Schema({
    rest_id: {
      type: Number,
      required: true,
    },
    dish_no: {
        type: Number,
        required: true,
        default: 0,
    }
  }
);

// Static method to get all dishes for a particular restaurant
restaurantdishcounterSchema.statics.getNextDishId = async function (rest_id) {
  try {
    const counter = await this.findOneAndUpdate(
      { rest_id },
      { $inc: { dish_no: 1 } },
      { new: true, upsert: true }
    );
    return counter.dish_no;
  } catch (error) {
    throw new Error("Error fetching next dish ID: " + error.message);
  }
};

const DishCounter = mongoose.model("DishCounter", restaurantdishcounterSchema);

module.exports = DishCounter;
