import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (productId, imageId) =>
    api.delete(`/products/${productId}/images/${imageId}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  getCategories: () => api.get("/products/categories"),
};

export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (productId) => api.post("/wishlist", { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const cartAPI = {
  get: () => api.get("/cart"),
  add: (productId, quantity) => api.post("/cart", { productId, quantity }),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete("/cart"),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params) => api.get("/orders/myorders", { params }),
  validateDiscount: (code, orderAmount) =>
    api.post("/orders/validate-discount", { code, orderAmount }),
  createPaymentIntent: (orderId) =>
    api.post("/orders/create-payment-intent", { orderId }),
  updateToPaid: (id, paymentResult) =>
    api.put(`/orders/${id}/pay`, paymentResult),
  getAll: (params) => api.get("/orders", { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const userAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const discountAPI = {
  getAll: (params) => api.get("/discounts", { params }),
  getById: (id) => api.get(`/discounts/${id}`),
  create: (data) => api.post("/discounts", data),
  update: (id, data) => api.put(`/discounts/${id}`, data),
  delete: (id) => api.delete(`/discounts/${id}`),
};

export const statsAPI = {
  getDashboard: () => api.get("/stats/dashboard"),
};

export default api;
