import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiTrendingUp,
} from "react-icons/fi";
import { statsAPI } from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await statsAPI.getDashboard();
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: FiDollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: "bg-purple-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {stats?.orderStats?.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Processing</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {stats?.orderStats?.processing || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipped</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {stats?.orderStats?.shipped || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Delivered</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {stats?.orderStats?.delivered || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {stats?.topProducts?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={
                    item._id?.images?.[0]?.url ||
                    "https://via.placeholder.com/40"
                  }
                  alt={item._id?.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm line-clamp-1">
                    {item._id?.name || "Unknown Product"}
                  </p>
                  <p className="text-gray-500 text-xs">{item.totalSold} sold</p>
                </div>
                <span className="text-green-600 font-medium">
                  ${item.revenue?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
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
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{order._id.slice(-8)}</td>
                  <td className="py-3 px-4 text-sm">{order.user?.name}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
