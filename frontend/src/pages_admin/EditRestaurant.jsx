import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRestaurant = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant } = location.state;

  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description);
  const [email, setEmail] = useState(restaurant.email);
  const [phoneNumber, setPhoneNumber] = useState(restaurant.phone_number);
  const [rating, setRating] = useState(restaurant.rating || "");
  const [images, setImages] = useState(restaurant.images);
  const [reviewers, setReviewers] = useState(restaurant.reviewers);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRestaurant = {
      name,
      description,
      email,
      phone_number: phoneNumber,
      rating,
      images,
      reviewers,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update_restaurant/${
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
      {/* Back Button */}
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

        {/* Editable Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label className="block text-gray-700 font-medium">Email id</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded-lg"
            min="1"
            max="5"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Images:</label>
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 mt-1">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Image URL"
                required
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Image
          </button>
        </div>
        {/* Reviewers Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Reviewers:
          </label>
          {reviewers.map((reviewer, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="mb-2">
                <label className="block text-gray-700 font-medium">Name:</label>
                <input
                  type="text"
                  value={reviewer.name}
                  onChange={(e) =>
                    handleReviewerChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 font-medium">
                  Rating:
                </label>
                <input
                  type="number"
                  value={reviewer.rating}
                  onChange={(e) =>
                    handleReviewerChange(index, "rating", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  min="1"
                  max="5"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 font-medium">
                  Comment:
                </label>
                <textarea
                  value={reviewer.comment}
                  onChange={(e) =>
                    handleReviewerChange(index, "comment", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
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

export default EditRestaurant;
