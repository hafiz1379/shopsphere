import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <FiHeart className="text-gray-600 hover:text-red-500" />
        </button>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-sm rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center text-yellow-400">
            <FiStar fill="currentColor" />
            <span className="ml-1 text-gray-600">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-sm ml-2">
            ({product.reviews} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
