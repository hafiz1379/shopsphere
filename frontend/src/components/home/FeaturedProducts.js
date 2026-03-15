import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { productAPI } from "../../services/api";
import ProductCard from "../common/ProductCard";
import Loading from "../common/Loading";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getAll({ featured: true, limit: 8 });
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked items just for you</p>
          </div>
          <Link
            to="/products?featured=true"
            className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <Loading type="skeleton" count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/products?featured=true"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
