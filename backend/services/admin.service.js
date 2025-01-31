const restaurantModel = require("../models/restaurant.model");

module.exports.createRestaurant = async ({
  rest_id,
  name,
  description,
  phone_number,
  rating,
  images,
  reviewers,
}) => {
  if (
    !rest_id ||
    !name ||
    !description ||
    !phone_number ||
    !images ||
    !reviewers
  ) {
    throw new Error("All fields are required except rating.");
  }

  // Validate reviewers array
  if (!Array.isArray(reviewers) || reviewers.length === 0) {
    throw new Error("At least one reviewer is required.");
  }

  reviewers.forEach((reviewer) => {
    if (!reviewer.name || !reviewer.rating || !reviewer.comment) {
      throw new Error("Each reviewer must have a name, rating, and comment.");
    }

    if (reviewer.rating < 1 || reviewer.rating > 5) {
      throw new Error("Reviewer rating must be between 1 and 5.");
    }
  });

  const restaurant = await restaurantModel.create({
    rest_id,
    name,
    description,
    phone_number,
    rating: rating || 0, // Default rating to 0 if not provided
    images,
    reviewers,
  });

  return restaurant;
};
