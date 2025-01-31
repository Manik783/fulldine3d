import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Camera, Menu, MapPin } from "lucide-react";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const categories = [
    { id: 1, name: "Veg", icon: "🟢" },
    { id: 2, name: "Spicy", icon: "🔺" },
    { id: 3, name: "Indian Cuisine" },
    { id: 4, name: "Indian Starter" },
  ];

  useEffect(() => {
    // Fetch data using Axios
    axios
      .get("http://localhost:4000/admin/dish_list/1")
      .then((response) => {
        const data = response.data;
        // Map the API response to menuItems format
        const items = data.dishes.map((dish) => ({
          id: dish.item_id,
          name: dish.name,
          price: dish.price,
          serves: dish.serves,
          isVeg: dish.isVeg,
          description: dish.description,
          image: dish.image,
        }));
        setMenuItems(items);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });
  }, []);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Location Header */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm">You're at</p>
            <h2 className="font-semibold">Jl. Soekarno Hatta 15A...</h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu, restaurant or etc"
            className="w-full px-4 py-3 pl-10 bg-white rounded-full border border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            className="px-4 py-2 bg-white rounded-full border border-gray-200 whitespace-nowrap"
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-sm flex justify-between"
          >
            <div className="space-y-2">
              {item.isVeg && <span className="text-green-600">●</span>}
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-lg">₹ {item.price}</p>
              <p className="text-sm text-gray-500">Serves {item.serves}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
                <button className="text-orange-500">...Read more</button>
              </p>
            </div>
            <div className="relative">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button className="absolute bottom-2 right-2 bg-white rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <span>AR Menu</span>
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Menu Button */}
      <button className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full p-4 shadow-lg">
        <Menu className="w-6 h-6" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium">
          MENU
        </span>
      </button>
    </div>
  );
}
