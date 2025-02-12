import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    //rest_id: "", not needed
    name: "",
    email: "",
    password: "",
    description: "",
    phone_number: "",
    rating: "",
    images: [""], // Array to handle multiple images
    reviewers: [{ name: "", rating: "", comment: "" }], // Array for multiple reviews
  });
  const token = localStorage.getItem("token");
  const naviagte = useNavigate();
  if (!token) {
    naviagte("/"); // Redirect to login page if no token is found
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleReviewerChange = (index, field, value) => {
    const updatedReviewers = [...formData.reviewers];
    updatedReviewers[index][field] = value;
    setFormData({ ...formData, reviewers: updatedReviewers });
  };

  const addReviewerField = () => {
    setFormData({
      ...formData,
      reviewers: [...formData.reviewers, { name: "", rating: "", comment: "" }],
    });
  };

  const removeReviewerField = (index) => {
    const updatedReviewers = formData.reviewers.filter((_, i) => i !== index);
    setFormData({ ...formData, reviewers: updatedReviewers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse phone_number and rating to numbers
    const parsedData = {
      ...formData,
      phone_number: Number(formData.phone_number),
      rating: formData.rating ? Number(formData.rating) : undefined, // Optional
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/addClient`,
        parsedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Restaurant added successfully!");
      //console.log(response.data);
      // Reset form fields
      setFormData({
        //rest_id: "",
        name: "",
        email: "",
        password: "",
        description: "",
        phone_number: "",
        rating: "",
        images: [""],
        reviewers: [{ name: "", rating: "", comment: "" }],
      });
    } catch (error) {
      console.error("Error adding restaurant:", error);
      alert("Failed to add restaurant.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Restaurant
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Restaurant ID */}
          {/* <div>
            <label
              htmlFor="rest_id"
              className="block text-sm font-medium text-gray-700"
            >
              Restaurant ID
            </label>
            <input
              type="number"
              id="rest_id"
              name="rest_id"
              value={formData.rest_id}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            />
          </div> */}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange} // Use the generic handleChange function
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // Use the generic handleChange function
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              min="1"
              max="5"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            {formData.images.map((image, index) => (
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

          {/* Reviewers */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reviewers
            </label>
            {formData.reviewers.map((reviewer, index) => (
              <div key={index} className="mt-4 p-4 border rounded-lg">
                <input
                  type="text"
                  value={reviewer.name}
                  onChange={(e) =>
                    handleReviewerChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="Reviewer Name"
                  required
                />
                <input
                  type="number"
                  value={reviewer.rating}
                  onChange={(e) =>
                    handleReviewerChange(index, "rating", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="Rating (1-5)"
                  min="1"
                  max="5"
                  required
                />
                <textarea
                  value={reviewer.comment}
                  onChange={(e) =>
                    handleReviewerChange(index, "comment", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Comment"
                  required
                ></textarea>
                <button
                  type="button"
                  onClick={() => removeReviewerField(index)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Remove Reviewer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addReviewerField}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Reviewer
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
