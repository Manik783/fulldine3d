import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

export default function RestaurantPage() {
  const { rest_id } = useParams(); // Get rest_id from route params
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null); // State to store restaurant data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/menu/restaurantinfo/${rest_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details.");
        }
        const data = await response.json();
        setRestaurant(data.restaurant); // Map API response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [rest_id]);

  // Loading and Error states
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-start gap-2">
        <div className="p-2 bg-red-50 rounded-lg">
          <MapPin className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="text-red-500">You're at</p>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {restaurant.images && restaurant.images.length > 0 ? (
          <>
            <div className="col-span-1 row-span-2">
              <img
                src={restaurant.images[0]}
                alt="Restaurant image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              {restaurant.images.slice(1).map((image, index) => (
                <div key={index} className="h-40">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No images available.
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-6">
        <h2 className="text-lg font-bold mb-2">About the Restaurant</h2>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>

      {/* Rating Overview */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl font-bold">{restaurant.rating}</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= restaurant.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Based on {restaurant.reviewers.length} reviews
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {restaurant.reviewers && restaurant.reviewers.length > 0 ? (
          <div className="space-y-4">
            {restaurant.reviewers.map((reviewer) => (
              <div
                key={reviewer._id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
                    {/* Placeholder for reviewer avatar */}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{reviewer.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(reviewer.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{reviewer.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between p-4">
        <button
          onClick={() => navigate(`/menu/${rest_id}`)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Go to Menu
        </button>
      </div>
    </div>
  );
}
