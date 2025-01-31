import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddDishClient = () => {
  const token = localStorage.getItem("token");
  const { rest_id } = useParams();
  const [formData, setFormData] = useState({
    rest_id: rest_id,
    item_id: "",
    name: "",
    price: "",
    serves: "",
    isVeg: "",
    category1: "",
    category2: "",
    category3: "",
    description: "",
    image: "",
  });

  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  if (!token) {
    navigate("/clientlogin"); // Redirect to login page if no token is found
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = async () => {
    if (!photo) {
      alert("Please select a photo to upload.");
      return;
    }

    const formPhoto = new FormData();
    formPhoto.append("file", photo);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dish/upload_photo`,
        formPhoto,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({ ...formData, image: response.data.fileUrl });
      alert("Photo uploaded successfully.");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {
      rest_id,
      item_id,
      name,
      price,
      serves,
      isVeg,
      category1,
      category2,
      category3,
      description,
      image,
    } = formData;

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
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/client/add_dish`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Dish added successfully!");
      navigate("/clientdashboard/${rest_id}");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add dish.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-600 text-xl font-bold hover:text-gray-800 transition duration-200"
      >
        &larr; Back
      </button>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add Dish</h2>

        {[
          { label: "Item ID", name: "item_id", type: "text" },
          { label: "Name", name: "name", type: "text" },
          { label: "Price", name: "price", type: "text" },
          { label: "Serves", name: "serves", type: "text" },
          { label: "Is Veg (true/false)", name: "isVeg", type: "text" },
          { label: "Category 1", name: "category1", type: "text" },
          { label: "Category 2", name: "category2", type: "text" },
          { label: "Category 3", name: "category3", type: "text" },
          { label: "Description", name: "description", type: "textarea" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-gray-700 font-medium mb-2">
              {field.label}:
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            )}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Photo:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handlePhotoUpload}
            className="mt-2 w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Upload Photo
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default AddDishClient;
