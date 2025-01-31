import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [restaurantIds, setRestaurantIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIds, setFilteredIds] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }
  const handleRestaurantClick = (rest_id) => {
    navigate(`/restaurantdishes/${rest_id}`);
  };

  useEffect(() => {
    const fetchRestaurantIds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/restaurants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const ids = response.data.restaurantsList;
        setRestaurantIds(ids);
        setFilteredIds(ids);
      } catch (error) {
        console.error("Error fetching restaurant IDs:", error);
      }
    };

    fetchRestaurantIds();
  }, []);
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredIds(restaurantIds);
    } else {
      const filtered = restaurantIds.filter((id) =>
        id.toString().toLowerCase().includes(query.toLowerCase())
      );
      setFilteredIds(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredIds(restaurantIds);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
          Restaurant Manager
        </h1>
        <Link
          to="/admincontrol"
          className="text-blue-600 font-medium hover:text-blue-800 transition"
        >
          Profile
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-4xl flex items-center mb-6 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          placeholder="Search by Restaurant ID..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-grow p-3 text-lg border-none focus:outline-none rounded-l-lg"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="px-4 text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Add Product Button */}
      <div className="mb-10">
        {/* <Link
          to="/add_dish"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Add Dish
        </Link> */}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredIds.map((id) => (
          <div
            key={id}
            onClick={() => handleRestaurantClick(id)}
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-2"
          >
            {/* Icon or Placeholder */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">{id}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Restaurant ID: {id}
            </h2>
          </div>
        ))}
        {filteredIds.length === 0 && (
          <p className="col-span-3 text-center text-gray-500">
            No results found for "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
