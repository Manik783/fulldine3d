const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sequence_value: { type: Number, required: true },
});

const CounterRestaurant = mongoose.model("Counter", counterSchema);

module.exports = CounterRestaurant;
