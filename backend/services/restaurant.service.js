const restaurantModel = require("../models/restaurant.model");

module.exports.createRestaurant = async ({
  //rest_id,
  name,
  email,
  password,
  description,
  phone_number,
  rating,
  images, // Updated from image to images (array)
  reviewers, // Updated from reviewer to reviewers (array)
}) => {
  // Validation: Ensure all required fields are provided and `images` is an array
  if (
    //!rest_id ||
    !email ||
    !name ||
    !password ||
    !description ||
    !phone_number ||
    !Array.isArray(images) || // Check if images is an array
    !Array.isArray(reviewers) // Check if reviewers is an array
  ) {
    throw new Error("All fields are required except rating.");
  }

  // Create the restaurant document
  const restaurant = await restaurantModel.create({
    //rest_id,
    name,
    email,
    password,
    description,
    phone_number,
    rating: rating || 0,
    images, // Save images array
    reviewers, // Save reviewers array
  });

  return restaurant;
};
