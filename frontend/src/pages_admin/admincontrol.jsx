import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminControl = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState(""); // Add state for admin name
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      localStorage.removeItem("token"); // Remove the token from local storage first

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/"); // Redirect to the home page after successful logout
      } else {
        console.error("Logout failed with status:", response.status);
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/"); // Redirect to login page if no token
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { fullName, email } = response.data.admin; // Extract admin details from the response
        setAdminEmail(email);
        setAdminName(`${fullName.firstName} ${fullName.lastName}`); // Combine firstName and lastName
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        alert("Failed to fetch admin profile. Please try again.");
      }
    };

    fetchAdminProfile();
  }, [navigate]); // Add `navigate` as a dependency to ensure stability

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      {/* Cross button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 right-4 text-gray-600 text-xl font-bold hover:text-gray-800 transition duration-200"
      >
        &times;
      </button>
      <button
        onClick={() => logout()}
        className="absolute top-14 right-4 text-gray-600 text-xl font-bold hover:text-gray-800 transition duration-200 bg-[##79717A]"
      >
        Logout
      </button>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-medium">Name:</span> {adminName || "Loading..."}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-medium">Email:</span>{" "}
          {adminEmail || "Loading..."}
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/addrestaurant"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-center"
          >
            Add New Restaurant
          </Link>
          <Link
            to="/addadmin"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-center"
          >
            Add New Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminControl;
