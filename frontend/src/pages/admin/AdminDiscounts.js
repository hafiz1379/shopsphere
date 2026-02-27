import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { discountAPI } from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchDiscounts();
  }, [pagination.page]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const { data } = await discountAPI.getAll({
        page: pagination.page,
        limit: 10,
      });
      setDiscounts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      value: Number(formData.value),
      minOrderAmount: formData.minOrderAmount
        ? Number(formData.minOrderAmount)
        : 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
    };

    try {
      if (editingDiscount) {
        await discountAPI.update(editingDiscount._id, submitData);
        toast.success("Discount updated successfully");
      } else {
        await discountAPI.create(submitData);
        toast.success("Discount created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchDiscounts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minOrderAmount: discount.minOrderAmount || "",
      maxDiscount: discount.maxDiscount || "",
      usageLimit: discount.usageLimit || "",
      startDate: discount.startDate?.split("T")[0] || "",
      endDate: discount.endDate?.split("T")[0] || "",
      isActive: discount.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?"))
      return;

    try {
      await discountAPI.delete(id);
      toast.success("Discount deleted successfully");
      fetchDiscounts();
    } catch (error) {
      toast.error("Failed to delete discount");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minOrderAmount: "",
      maxDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setEditingDiscount(null);
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discount Codes</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Discount
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Value
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Usage
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Valid Until
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => (
                    <tr
                      key={discount._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">
                          {discount.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {discount.type}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {discount.type === "percentage"
                          ? `${discount.value}%`
                          : `$${discount.value}`}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {discount.usedCount} / {discount.usageLimit || "∞"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(discount.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            !discount.isActive
                              ? "bg-gray-100 text-gray-800"
                              : isExpired(discount.endDate)
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {!discount.isActive
                            ? "Inactive"
                            : isExpired(discount.endDate)
                              ? "Expired"
                              : "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(discount)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(discount._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {discounts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No discount codes found. Create your first one!
              </div>
            )}

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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingDiscount ? "Edit Discount" : "Add Discount"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="input-field uppercase"
                    placeholder="SUMMER20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Value {formData.type === "percentage" ? "(%)" : "($)"}
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                      max={formData.type === "percentage" ? 100 : undefined}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Min Order ($)
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Max Discount ($)
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                      placeholder="No limit"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="input-field"
                    min="1"
                    placeholder="Unlimited"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Active</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingDiscount ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;
