import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const [firstName, setFirstName] = useState(""); // State for first name
  const [lastName, setLastName] = useState(""); // State for last name
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/admin_signup`,
        {
          fullName: {
            firstName, // Pass firstName
            lastName, // Pass lastName
          },
          email, // Pass email
          password, // Pass password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization token
          },
        }
      );

      if (response.status === 201) {
        alert("Admin added successfully!");
        navigate("/admincontrol"); // Redirect to admin control page
      } else {
        alert("Failed to add admin. Please try again.");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleAddAdmin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Admin</h1>

        {/* First Name Input */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-medium mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Last Name Input */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 font-medium mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
