import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Camera, Menu, MapPin, Filter } from "lucide-react";
import { useParams } from "react-router-dom";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [vegOnly, setVegOnly] = useState(false);

  const categories = [
    { id: 1, name: "Veg", icon: "🟢" },
    { id: 2, name: "Spicy", icon: "🔺" },
    { id: 3, name: "Indian Cuisine" },
    { id: 4, name: "Indian Starter" },
  ];

  const { rest_id } = useParams();

  useEffect(() => {
    // Fetch data using Axios
    axios
      .get(`${import.meta.env.REACT_APP_BASE_URL}/menu/dishes/${rest_id}`)
      .then((response) => {
        const data = response.data;
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
        setFilteredItems(items);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });
  }, [rest_id]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = menuItems;

    // Apply veg filter
    if (vegOnly) {
      filtered = filtered.filter((item) => item.isVeg);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, vegOnly, menuItems]);

  // Toggle function for veg/non-veg switch
  const toggleVegOnly = () => {
    setVegOnly(!vegOnly);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Location Header */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">You're at</p>
            <h2 className="font-medium text-gray-900">
              Jl. Soekarno Hatta 15A...
            </h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search menu, restaurant or etc"
            className="w-full px-4 py-3 pl-10 bg-white rounded-full border border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
          <button className="absolute right-3">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Categories and Veg Toggle */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Custom toggle switch */}
            <button
              onClick={toggleVegOnly}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                vegOnly ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  vegOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium">Veg Only</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 bg-white rounded-full border border-gray-200 whitespace-nowrap text-sm"
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.isVeg && (
                    <span className="w-4 h-4 border-2 border-green-600 p-0.5">
                      <span className="block w-full h-full bg-green-600 rounded-full" />
                    </span>
                  )}
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <p className="font-medium">₹ {item.price}</p>
                <p className="text-sm text-gray-500">Serves {item.serves}</p>
              </div>
              <img
                src={
                  item.image ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-01%20at%209.24.26%E2%80%AFPM-ExCDkSjCkyIbE2WVhmEN5b03zysism.png"
                }
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 border border-red-500 rounded-lg text-red-500 text-sm font-medium">
                Order Online
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium flex items-center gap-2">
                <span>View in AR</span>
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Menu Button */}
      <button className="fixed bottom-8 right-1/2 translate-x-1/2 bg-red-500 text-white rounded-full p-4 shadow-lg flex flex-col items-center">
        <Menu className="w-6 h-6" />
        <span className="text-xs font-medium mt-1">MENU</span>
      </button>
    </div>
  );
}
