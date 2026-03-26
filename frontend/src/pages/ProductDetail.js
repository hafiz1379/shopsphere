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
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getById(id);
      setProduct(data.data || data.product || data);
    } catch (error) {
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success("Added to cart!");
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
    setAddingToCart(false);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      navigate("/login");
      return;
    }
    toggleWishlist(product._id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);

      if (productAPI.createReview) {
        await productAPI.createReview(product._id, reviewForm);
      } else if (productAPI.addReview) {
        await productAPI.addReview(product._id, reviewForm);
      } else {
        toast.error("Review API is not configured in frontend");
        return;
      }

      toast.success("Review submitted successfully");
      setReviewForm({ rating: 5, comment: "" });
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  const inWishlist = isInWishlist(product._id);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/600" }];

  const ratingValue =
    product.ratings ?? product.rating ?? product.averageRating ?? 0;

  const reviewCount = product.numReviews ?? product.reviews?.length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <Link
              to="/products"
              className="hover:text-primary-600 transition-colors"
            >
              Shop
            </Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === i
                        ? "border-primary-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
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
            <p className="text-sm text-primary-600 font-semibold uppercase tracking-wide mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={18}
                    className={
                      i < Math.round(ratingValue)
                        ? "text-accent-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-800">
                {Number(ratingValue).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="badge bg-rose-100 text-rose-700">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-6 py-3 font-semibold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={18} />
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3.5 rounded-xl border-2 transition-all ${
                      inWishlist
                        ? "border-rose-500 bg-rose-50 text-rose-500"
                        : "border-gray-200 text-gray-400 hover:border-rose-500 hover:text-rose-500"
                    }`}
                  >
                    <FiHeart
                      size={20}
                      className={inWishlist ? "fill-current" : ""}
                    />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              {[
                { icon: FiTruck, label: "Free Shipping" },
                { icon: FiShield, label: "Secure Payment" },
                { icon: FiRefreshCw, label: "Easy Returns" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="p-2.5 bg-primary-50 rounded-lg text-primary-600">
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-5">
                {product.reviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.name || review.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={15}
                            className={
                              i < Math.round(review.rating || 0)
                                ? "text-accent-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Write a Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar
                        size={24}
                        className={
                          star <= reviewForm.rating
                            ? "text-accent-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  rows="5"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value,
                    })
                  }
                  placeholder="Share your experience with this product..."
                  className="input-field resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="btn-primary w-full"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
