import React from "react";

const MenuItem = ({ item, onItemClick }) => {
  return (
    <div
      className="mb-4 cursor-pointer bg-white shadow-custom rounded-lg p-4 hover:bg-gray-100 transition"
      onClick={() => onItemClick(item)}
    >
      <img
        src={item.staticImage}
        alt={item.name}
        className="w-full h-auto object-contain"
      />
      <h3 className="text-lg font-bold mt-2">{item.name}</h3>
      <p className="text-brand-primary font-medium">₹{item.price}</p>
      <p className="text-gray-600 text-sm">{item.servingInfo}</p>
    </div>
  );
};

export default MenuItem;
