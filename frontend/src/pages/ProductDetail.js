import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiStar,
  FiTruck,
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { productAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Loading from "../components/common/Loading";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getById(id);
      setProduct(data.data);
    } catch (error) {
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success("Added to cart");
    } else {
      toast.error(result.message);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to use wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist(product._id)) {
      const result = await removeFromWishlist(product._id);
      if (result.success) toast.success("Removed from wishlist");
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) toast.success("Added to wishlist");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please login to write a review");
      return;
    }

    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, reviewForm);
      toast.success("Review added successfully");
      setReviewForm({ rating: 5, comment: "" });
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loading />;

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

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[selectedImage]?.url
      : "https://via.placeholder.com/600x600?text=No+Image";

  const inWishlist = isInWishlist(product._id);

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
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-primary-600 font-medium">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-gray-400 ml-2">| {product.brand}</span>
          )}
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
              {product.rating?.toFixed(1)} ({product.numReviews} reviews)
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

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 10
                  ? "bg-green-100 text-green-800"
                  : product.stock > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </span>
          </div>

          {product.stock > 0 && (
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
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-3 hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 border rounded-lg transition-colors ${
                inWishlist
                  ? "bg-red-500 text-white border-red-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <FiHeart
                className={inWishlist ? "fill-current" : "text-gray-600"}
              />
            </button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <FiTruck className="text-primary-600" size={20} />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiShield className="text-primary-600" size={20} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Customer Reviews
        </h2>

        {isAuthenticated && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: star })
                    }
                    className="p-1"
                  >
                    <FiStar
                      size={24}
                      className={
                        star <= reviewForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Comment
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                className="input-field h-24"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {review.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
