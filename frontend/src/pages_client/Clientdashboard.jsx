import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Clientdashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const { rest_id } = useParams();
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const navigate = useNavigate();
  if (!token) {
    navigate("/clientlogin"); // Redirect to login page if no token is found
  }
  const handleToggleAvailability = async (item_id, currentStatus) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/client/availability/${rest_id}/${item_id}/${!currentStatus}`,
        { availability: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDishes((prevDishes) =>
          prevDishes.map((dish) =>
            dish.item_id === item_id
              ? { ...dish, availability: !currentStatus }
              : dish
          )
        );
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility");
    }
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/client/dishes/${rest_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDishes(response.data.dishes); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after the request completes
      }
    };

    fetchDishes();
  }, [rest_id, token]);

  const handleDishClick = (dish) => {
    navigate(`/editdishclient/${rest_id}/${dish.item_id}`, { state: { dish } });
  };

  const handleAddDishClick = () => {
    navigate(`/add_dish_client/${rest_id}`); // Pass the restaurant ID to the Add Dish page
  };
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      localStorage.removeItem("token"); // Remove the token from local storage first

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/client/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/clientlogin"); // Redirect to the home page after successful logout
      } else {
        navigate("/clientlogin");
        console.error("Logout failed with status:", response.status);
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  const handleGetInfoClick = () => {
    navigate(`/restauantdetailsclient/${rest_id}`); // Pass the restaurant ID to the Get
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => logout()}
        className="absolute top-4 right-4 text-gray-600 text-xl font-bold hover:text-gray-800 transition duration-200"
      >
        Logout
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Restaurant Dishes
          </h1>
          {/* Get restaurant information */}
          <button
            onClick={() => handleGetInfoClick()}
            className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get info
          </button>
          {/* Add Dish Button */}
          <button
            onClick={() => handleAddDishClick()}
            className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Add Dish
          </button>
        </div>

        {/* Dish List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-gray-50 border rounded-lg p-4 shadow hover:shadow-md transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {dish.name}
              </h3>
              <p className="text-gray-700">
                <span className="font-medium">Views:</span> {dish.viewcount}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">3D Visibility:</span>{" "}
                {dish.availability ? "Enabled" : "Disabled"}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDishClick(dish)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleToggleAvailability(dish.item_id, dish.availability)
                  }
                  className={`px-4 py-2 text-white rounded-lg shadow-md transition ${
                    !dish.availability
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {dish.availability ? "false" : "true"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {dishes.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            No dishes available for this restaurant.
          </p>
        )}
      </div>
    </div>
  );
};

export default Clientdashboard;
