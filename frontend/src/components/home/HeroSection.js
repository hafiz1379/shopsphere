import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-fade-in">
            🎉 Free shipping on orders over $50
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-fade-in-up">
            Discover Your
            <br />
            <span className="text-accent-400">Perfect Style</span>
          </h1>
          <p className="text-lg text-white/75 mt-6 leading-relaxed max-w-lg animate-fade-in-up animate-delay-100">
            Shop the latest trends with confidence. Premium quality products,
            unbeatable prices, and fast delivery right to your door.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up animate-delay-200">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
            >
              Shop Now <FiArrowRight />
            </Link>
            <Link
              to="/products?featured=true"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              Featured Products
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: FiTruck,
                title: "Free Shipping",
                desc: "On orders over $50",
              },
              {
                icon: FiShield,
                title: "Secure Payment",
                desc: "100% protected",
              },
              {
                icon: FiRefreshCw,
                title: "Easy Returns",
                desc: "30-day returns",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="p-2.5 bg-white/10 rounded-lg">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
