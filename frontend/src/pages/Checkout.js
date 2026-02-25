import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FiCreditCard, FiCheck, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/api";

const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");

const CheckoutForm = ({ order, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await orderAPI.createPaymentIntent(order._id);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await orderAPI.updateToPaid(order._id, {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          updateTime: new Date().toISOString(),
          emailAddress: "",
        });
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
          <CardElement options={cardStyle} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Test card: 4242 4242 4242 4242 | Any future date | Any CVC
        </p>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary py-3 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FiCreditCard />
        {loading ? "Processing..." : `Pay $${order.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      const { data } = await orderAPI.validateDiscount(
        discountCode,
        cart.totalPrice,
      );
      setDiscount(data.data);
      toast.success(
        `Discount applied: -$${data.data.discountAmount.toFixed(2)}`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid discount code");
      setDiscount(null);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCreateOrder = async () => {
    setLoading(true);

    try {
      const { data } = await orderAPI.create({
        shippingAddress,
        paymentMethod: "stripe",
        discountCode: discount?.code,
      });

      setOrder(data.data);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Thank you for your order.");
    fetchCart();
    navigate(`/orders/${order._id}`);
  };

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = itemsPrice * 0.1;
  const discountAmount = discount?.discountAmount || 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h2>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: "Shipping" },
          { num: 2, label: "Review" },
          { num: 3, label: "Payment" },
        ].map((s, index) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s.num ? <FiCheck /> : s.num}
              </div>
              <span className="text-xs mt-1 text-gray-600">{s.label}</span>
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-1 mx-2 ${step > s.num ? "bg-primary-600" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="United States"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="input-field"
                      placeholder="+1 234 567 8900"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4">
                  Continue to Review
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Review Order
              </h2>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Shipping To:</h3>
                <p className="text-gray-600">{shippingAddress.fullName}</p>
                <p className="text-gray-600">{shippingAddress.address}</p>
                <p className="text-gray-600">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p className="text-gray-600">{shippingAddress.country}</p>
                <p className="text-gray-600">{shippingAddress.phone}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Order Items:</h3>
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 py-3 border-b"
                  >
                    <img
                      src={
                        item.product.images?.[0]?.url ||
                        "https://via.placeholder.com/60"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? "Creating Order..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && order && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment
              </h2>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Order created successfully! Order ID:{" "}
                  <span className="font-mono">{order._id.slice(-8)}</span>
                </p>
              </div>
              <Elements stripe={stripePromise}>
                <CheckoutForm order={order} onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="max-h-48 overflow-y-auto mb-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex gap-3 mb-3">
                  <img
                    src={
                      item.product.images?.[0]?.url ||
                      "https://via.placeholder.com/50"
                    }
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {step < 3 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) =>
                        setDiscountCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter code"
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleApplyDiscount}
                    className="btn-secondary text-sm px-4"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shippingPrice === 0
                    ? "Free"
                    : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
