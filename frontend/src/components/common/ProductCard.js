import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const inWishlist = isInWishlist(product._id);

  const ratingValue =
    product.ratings ?? product.rating ?? product.averageRating ?? 0;

  const reviewCount = product.numReviews ?? product.reviews?.length ?? 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success("Added to cart!");
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }

    toggleWishlist(product._id);
  };

  const discountPercent =
    product.discount ||
    (product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0);

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercent > 0 && (
              <span className="badge bg-rose-500 text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="badge bg-accent-500 text-white shadow-sm">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-800 text-white shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200
              ${
                inWishlist
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white"
              }`}
          >
            <FiHeart size={16} className={inWishlist ? "fill-current" : ""} />
          </button>

          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-lg"
              >
                <FiShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
            {product.category}
          </p>

          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={13}
                  className={
                    i < Math.round(ratingValue)
                      ? "text-accent-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {Number(ratingValue).toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
