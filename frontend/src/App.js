import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDiscounts from "./pages/admin/AdminDiscounts";

const StorefrontLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="discounts" element={<AdminDiscounts />} />
              </Route>

              <Route
                path="/"
                element={
                  <StorefrontLayout>
                    <Home />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <StorefrontLayout>
                    <Products />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <StorefrontLayout>
                    <ProductDetail />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <StorefrontLayout>
                    <Login />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <StorefrontLayout>
                    <Register />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <StorefrontLayout>
                    <Cart />
                  </StorefrontLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <StorefrontLayout>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </StorefrontLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <StorefrontLayout>
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  </StorefrontLayout>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <StorefrontLayout>
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  </StorefrontLayout>
                }
              />
              <Route
                path="*"
                element={
                  <StorefrontLayout>
                    <NotFound />
                  </StorefrontLayout>
                }
              />
            </Routes>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
