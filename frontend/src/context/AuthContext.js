import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api";

  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/auth/me`);
        setUser(response.data.data);
      }
    } catch (err) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { data, token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(data);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { data, token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(data);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      setUser(response.data.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";
      setError(message);
      return { success: false, message };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put(`${API_URL}/users/password`, {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Password update failed";
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
