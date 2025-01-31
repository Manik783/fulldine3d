import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDish = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dish } = location.state; // Access dish data
  const { item_id, rest_id } = useParams();

  // Local state for editable fields
  const [price, setPrice] = useState(dish.price);
  const [serves, setServes] = useState(dish.serves);
  const [isVeg, setIsVeg] = useState(dish.isVeg);
  const [description, setDescription] = useState(dish.description);
  const [category1, setCategory1] = useState(dish.category1);
  const [category2, setCategory2] = useState(dish.category2);
  const [category3, setCategory3] = useState(dish.category3);
  const [image, setImage] = useState(dish.image);
  const [glbUrl, setGlbUrl] = useState(dish.glb_url || "");
  const [usdzUrl, setUsdzUrl] = useState(dish.usdz_url || "");

  const token = localStorage.getItem("token"); // Retrieve token for authorization
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDish = {
      rest_id,
      item_id,
      name: dish.name,
      price,
      serves,
      isVeg,
      description,
      category1,
      category2,
      category3,
      image,
      glb_url: glbUrl,
      usdz_url: usdzUrl,
    };

    try {
      await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/admin/update_dish/${rest_id}/${item_id}`,
        updatedDish,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Dish updated successfully!");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Failed to update the dish. Please try again.");
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Dish</h1>

        {/* Non-editable Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Dish Name:</label>
          <p className="text-gray-600 bg-gray-50 p-2 rounded-lg">{dish.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">View Count:</label>
          <p className="text-gray-600 bg-gray-50 p-2 rounded-lg">
            {dish.viewcount}
          </p>
        </div>

        {/* Editable Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Serves:</label>
          <input
            type="number"
            value={serves}
            onChange={(e) => setServes(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Is Vegetarian:
          </label>
          <select
            value={isVeg}
            onChange={(e) => setIsVeg(e.target.value === "true")}
            className="w-full p-2 border rounded-lg"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
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
          <label className="block text-gray-700 font-medium">Category 1:</label>
          <input
            type="text"
            value={category1}
            onChange={(e) => setCategory1(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category 2:</label>
          <input
            type="text"
            value={category2}
            onChange={(e) => setCategory2(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category 3:</label>
          <input
            type="text"
            value={category3}
            onChange={(e) => setCategory3(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* New Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">GLB URL:</label>
          <input
            type="text"
            value={glbUrl}
            onChange={(e) => setGlbUrl(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">USDZ URL:</label>
          <input
            type="text"
            value={usdzUrl}
            onChange={(e) => setUsdzUrl(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
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

export default EditDish;
