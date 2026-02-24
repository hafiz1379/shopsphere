import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const result = await updateQuantity(productId, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      const result = await clearCart();
      if (result.success) {
        toast.success("Cart cleared");
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please login to proceed to checkout");
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <Loading />;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items yet.
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 p-6 border-b last:border-b-0"
              >
                <img
                  src={
                    item.product.images?.[0]?.url ||
                    "https://via.placeholder.com/100"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="text-lg font-semibold text-gray-800 hover:text-primary-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-primary-600 font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity - 1,
                        )
                      }
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity + 1,
                        )
                      }
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-lg font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cart.totalItems})</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{cart.totalPrice > 100 ? "Free" : "$10.00"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${(cart.totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>
                  $
                  {(
                    cart.totalPrice +
                    (cart.totalPrice > 100 ? 0 : 10) +
                    cart.totalPrice * 0.1
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <Link
              to="/products"
              className="block text-center text-primary-600 hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
