import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const { rest_id } = useParams(); // Get rest_id from route parameters
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [restaurant, setRestaurant] = useState(null); // State to store restaurant details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

  // Navigate to the EditRestaurant page with the current restaurant data
  const EditRestaurant = () => {
    navigate(`/editrestaurant/${rest_id}`, { state: { restaurant } });
  };
  if (!token) {
    navigate("/"); // Redirect to login page if no token is found
  }

  // Fetch restaurant details from the API
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/admin/restaurantinfo/${rest_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details.");
        }
        const data = await response.json();
        setRestaurant(data.restaurant);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [rest_id]);

  // Render loading and error states
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white my-60 rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
        <p className="text-gray-600">{restaurant.description}</p>
      </div>

      <div className="flex flex-col items-start space-y-2">
        <p>
          <strong>Phone:</strong> {restaurant.phone_number}
        </p>
        <p>
          <strong>Rating:</strong> {restaurant.rating}
        </p>
        {restaurant.images.length > 0 && (
          <div>
            <strong>Images:</strong>
            <div className="flex gap-2 mt-2">
              {restaurant.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Restaurant ${index + 1}`}
                  className="w-24 h-24 rounded-md border"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow"
        >
          Go Back
        </button>

        {/* Edit Details Button */}
        <button
          onClick={EditRestaurant}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
