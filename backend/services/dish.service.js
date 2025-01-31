const DishModel = require("../models/dish.model");

// no need to put constraint on the .glb and .usdz files because client can add dishes
// without 3d models
module.exports.createProduct = async ({
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
}) => {
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

  return dish;
};
