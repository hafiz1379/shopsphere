import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategorySection from "../components/home/CategorySection";
import Newsletter from "../components/home/Newsletter";

const Home = () => {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
};

export default Home;
