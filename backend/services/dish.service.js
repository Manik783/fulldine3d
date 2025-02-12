const DishModel = require("../models/dish.model");
const DishCounter = require("../models/counter.dish.model");
// no need to put constraint on the .glb and .usdz files because client can add dishes
// without 3d models
module.exports.createProduct = async ({
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
}) => {
  const updatedItem = await DishCounter.findOneAndUpdate(
    { rest_id },
    { $inc: { dish_no: 1 } }, // Atomic increment in MongoDB
    { new: true } // Returns the updated document
  );
  const item_id = updatedItem.dish_no;

  // console.log(item_id); // The new incremented value

  if (
    !rest_id ||
    !item_id ||
    !name ||
    !price ||
    !serves ||
    !isVeg ||
    !description ||
    !image
  ) {
    throw new Error("All fields are required");
  }
  const dish = await DishModel.create({
    rest_id: rest_id,
    item_id: item_id,
    name: name,
    price: price,
    serves: serves,
    isVeg: isVeg,
    description: description,
    category1: category1,
    category2: category2,
    category3: category3,
    image: image,
    glb_url: glb_url || "",
    usdz_url: usdz_url || "",
  });
  // const dishCounter = await DishCounter.getNextDishId(rest_id);

  return dish;
};
