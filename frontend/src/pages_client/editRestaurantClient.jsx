import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRestaurantClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { restaurant } = location.state;
  if (!token) {
    navigate("/clientlogin");
  }

  const [description, setDescription] = useState(restaurant.description);
  const [email, setEmail] = useState(restaurant.email);
  const [phoneNumber, setPhoneNumber] = useState(restaurant.phone_number);
  const [images, setImages] = useState(restaurant.images || []);

  const handleImageChange = (index, newUrl) => {
    const updatedImages = [...images];
    updatedImages[index] = newUrl;
    setImages(updatedImages);
  };

  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRestaurant = {
      name: restaurant.name,
      description,
      email,
      phone_number: phoneNumber,
      rating: restaurant.rating,
      images,
      reviewers: restaurant.reviewers,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/client/update_restaurant/${
          restaurant.rest_id
        }`,
        updatedRestaurant,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Restaurant updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Failed to update the restaurant. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-600 text-xl font-bold hover:text-gray-800 transition duration-200"
      >
        &larr; Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Restaurant
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Phone Number:
          </label>
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email ID:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Images:</label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 mt-2"
          >
            Add Image
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditRestaurantClient;
