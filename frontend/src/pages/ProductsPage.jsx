import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const minPriceQuery = searchParams.get("minPrice") || "";
  const maxPriceQuery = searchParams.get("maxPrice") || "";

  const { products, loading, error, refetch } = useProducts(
    searchQuery,
    categoryQuery,
    minPriceQuery,
    maxPriceQuery,
  );

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [minPrice, setMinPrice] = useState(minPriceQuery);
  const [maxPrice, setMaxPrice] = useState(maxPriceQuery);

  // Categories for filtering
  const categories = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "home", label: "Home & Kitchen" },
    { value: "beauty", label: "Beauty" },
    { value: "sports", label: "Sports" },
  ];

  // Handle search and category filter
  useEffect(() => {
    refetch();
  }, [refetch, searchQuery, categoryQuery, minPriceQuery, maxPriceQuery]);

  const handleFilter = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newSearchParams.set("search", searchTerm.trim());
    } else {
      newSearchParams.delete("search");
    }

    if (selectedCategory) {
      newSearchParams.set("category", selectedCategory);
    } else {
      newSearchParams.delete("category");
    }

    if (minPrice !== "") {
      newSearchParams.set("minPrice", minPrice);
    } else {
      newSearchParams.delete("minPrice");
    }

    if (maxPrice !== "") {
      newSearchParams.set("maxPrice", maxPrice);
    } else {
      newSearchParams.delete("maxPrice");
    }

    window.location.search = newSearchParams.toString();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");

    const newSearchParams = new URLSearchParams();
    window.location.search = newSearchParams.toString();
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>

      {/* Filter Section */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <form
          onSubmit={handleFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <div className="lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {products?.length || 0} product{products?.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <Loader />
        </div>
      )}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}
      {products && products.length > 0 && (
        <div className="mx-[-1rem] lg:mx-[-2rem]">
          {" "}
          {/* This breaks out of container slightly */}
          <ProductList products={products} />
        </div>
      )}
      {!loading && !error && products && products.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter to find what you're looking for
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
