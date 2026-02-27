import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { orderAPI } from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const { data } = await orderAPI.getAll(params);
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="input-field max-w-xs"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Payment
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono">
                        {order._id.slice(-8)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`px-2 py-1 rounded text-xs border-0 ${getStatusColor(order.status)}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/orders/${order._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-block"
                        >
                          <FiEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
