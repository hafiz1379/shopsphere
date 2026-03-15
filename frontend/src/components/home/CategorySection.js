import React from "react";
import { Link } from "react-router-dom";
import {
  FiMonitor,
  FiShoppingBag,
  FiActivity,
  FiHome,
  FiCoffee,
  FiWatch,
} from "react-icons/fi";

const categories = [
  {
    name: "Electronics",
    icon: FiMonitor,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Fashion",
    icon: FiShoppingBag,
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
  },
  {
    name: "Sports",
    icon: FiActivity,
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
  },
  {
    name: "Home",
    icon: FiHome,
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Food",
    icon: FiCoffee,
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
  },
  {
    name: "Accessories",
    icon: FiWatch,
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you need</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group text-center"
            >
              <div
                className={`${cat.bg} rounded-2xl p-6 mb-3 group-hover:scale-105 transition-transform duration-300`}
              >
                <div
                  className={`w-14 h-14 mx-auto bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <cat.icon size={24} className="text-white" />
                </div>
              </div>
              <span className="font-medium text-gray-700 group-hover:text-primary-600 transition-colors text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
