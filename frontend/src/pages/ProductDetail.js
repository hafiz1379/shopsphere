import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiStar,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import products from "../data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product not found
        </h2>
        <Link to="/products" className="text-primary-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary-600">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-primary-600">
          Products
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-primary-600 font-medium">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                Save {product.discount}%
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100"
              >
                <FiMinus />
              </button>
              <span className="px-6 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
              <FiHeart className="text-gray-600" />
            </button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <FiTruck className="text-primary-600" size={20} />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiShield className="text-primary-600" size={20} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
