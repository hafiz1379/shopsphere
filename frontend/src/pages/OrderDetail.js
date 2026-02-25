import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPackage, FiTruck, FiCheck, FiClock } from "react-icons/fi";
import { orderAPI } from "../services/api";
import Loading from "../components/common/Loading";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getById(id);
      setOrder(data.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "processing":
        return <FiPackage className="text-blue-500" />;
      case "shipped":
        return <FiTruck className="text-purple-500" />;
      case "delivered":
        return <FiCheck className="text-green-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Order not found
        </h2>
        <Link to="/profile" className="text-primary-600 hover:underline">
          View all orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        <span
          className={`px-4 py-2 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}
        >
          {getStatusIcon(order.status)} {order.status}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Order Information
            </h3>
            <p className="text-gray-600">Order ID: {order._id}</p>
            <p className="text-gray-600">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Payment: {order.paymentMethod}</p>
            <p className={order.isPaid ? "text-green-600" : "text-red-600"}>
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : "Not Paid"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Shipping Address
            </h3>
            <p className="text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">{order.shippingAddress.country}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
        {order.orderItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 py-4 border-b last:border-b-0"
          >
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <Link
                to={`/products/${item.product}`}
                className="font-medium text-gray-800 hover:text-primary-600"
              >
                {item.name}
              </Link>
              <p className="text-gray-500">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.discountCode})</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
