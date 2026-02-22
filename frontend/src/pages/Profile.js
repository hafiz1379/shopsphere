import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiPackage,
  FiHeart,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile(profileData);

    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const result = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );

    if (result.success) {
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "orders", label: "Orders", icon: FiPackage },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "security", label: "Security", icon: FiLock },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-primary-600" size={32} />
              </div>
              <h2 className="font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Profile Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiSave />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order History
                </h2>
                <div className="text-center py-12 text-gray-500">
                  <FiPackage size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No orders yet</p>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  My Wishlist
                </h2>
                <div className="text-center py-12 text-gray-500">
                  <FiHeart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Your wishlist is empty</p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Change Password
                </h2>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6 max-w-md"
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiLock />
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
