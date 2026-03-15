import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { productAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";
import Loading from "../components/common/Loading";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Sports",
  "Home",
  "Food",
  "Accessories",
];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
      if (currentSearch) params.search = currentSearch;
      if (currentCategory !== "All") params.category = currentCategory;
      if (currentSort) params.sort = currentSort;
      if (searchParams.get("featured")) params.featured = true;

      const { data } = await productAPI.getAll(params);
      setProducts(data.data || data.products || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  const hasActiveFilters =
    currentSearch || currentCategory !== "All" || currentSort !== "newest";

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentSearch
              ? `Results for "${currentSearch}"`
              : currentCategory !== "All"
                ? currentCategory
                : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">
            {!loading && `${products.length} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </form>

            {/* Sort */}
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="appearance-none bg-gray-50 text-sm px-4 py-2.5 pr-10 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-700"
            >
              <FiFilter size={16} /> Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={14} /> Clear
              </button>
            )}
          </div>

          {/* Category Tags */}
          <div
            className={`flex flex-wrap gap-2 mt-4 ${showFilters ? "block" : "hidden lg:flex"}`}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilter("category", cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentCategory === cat
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loading type="skeleton" count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter("page", String(i + 1))}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
