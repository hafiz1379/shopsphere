import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const HeroSection = () => {
  // --- Slider State ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
      alt: "Summer collection showcase",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern minimal store interior",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      alt: "Trendy fashion close-up",
    },
  ];

  // Auto‑rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // --- Render ---
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient (unchanged colors) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* --- LEFT: Text Content (kept colors & fonts) --- */}
          <div className="max-w-2xl space-y-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
              🎉 Free shipping on orders over $50
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Discover Your
              <br />
              <span className="text-accent-400">Perfect Style</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed max-w-lg">
              Shop the latest trends with confidence. Premium quality products,
              unbeatable prices, and fast delivery right to your door.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/products?featured=true"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                Featured Products
              </Link>
            </div>
          </div>

          {/* --- RIGHT: Image Slider (Modern, 3 images) --- */}
          <div className="relative h-[360px] sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/5">
            {/* Gradient overlay to keep text readable if it overlaps on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent z-10" />

            {/* Slides */}
            <div className="relative h-full w-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows (visible on hover) */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next slide"
            >
              <FiChevronRight size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- Trust Bar (unchanged structure & colors) --- */}
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
