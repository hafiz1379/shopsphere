import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(productId, newQuantity);
    if (!result.success) toast.error(result.message);
  };

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Waiting
          </h2>
          <p className="text-gray-500 mb-6">Sign in to view your cart items</p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product || item;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 flex gap-4 sm:gap-6"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                  >
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/200"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/products/${product._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {product.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        ${(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-primary w-full mt-6"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <FiArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
