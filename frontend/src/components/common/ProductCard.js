import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please login to add items to wishlist");
      return;
    }

    if (inWishlist) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        toast.success("Removed from wishlist");
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        toast.success("Added to wishlist");
      } else {
        toast.error(result.message);
      }
    }
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
            inWishlist
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiHeart className={inWishlist ? "fill-current" : ""} />
        </button>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-sm rounded">
            -{product.discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center text-yellow-400">
            <FiStar fill="currentColor" />
            <span className="ml-1 text-gray-600">
              {product.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-gray-400 text-sm ml-2">
            ({product.numReviews || 0} reviews)
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
          <button
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
