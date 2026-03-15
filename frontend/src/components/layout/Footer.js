import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">ShopSphere</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your one-stop destination for quality products. We deliver
              excellence with every order, backed by trusted service and secure
              payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "All Products" },
                { to: "/profile", label: "My Account" },
                { to: "/cart", label: "Shopping Cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              {["Electronics", "Fashion", "Sports", "Home", "Accessories"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to={`/products?category=${cat}`}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMapPin
                  size={16}
                  className="text-primary-400 flex-shrink-0"
                />
                <span>Kabul, Afghanistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={16} className="text-primary-400 flex-shrink-0" />
                <span>+93 700 000 000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={16} className="text-primary-400 flex-shrink-0" />
                <span>support@shopsphere.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ShopSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-500">Privacy Policy</span>
              <span className="text-xs text-gray-500">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
