import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  // Get featured products (first 4 products)
  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Shop the latest trends with exclusive deals and fast delivery
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader />
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-600">{error}</div>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="transform transition-transform hover:-translate-y-1"
                >
                  {/* ProductCard will handle its own addToCart functionality */}
                  <div className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden">
                    <div className="relative">
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";
                        }}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        &#8377; {product.price}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col p-4">
                      <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                        {product.description
                          ? product.description.length > 80
                            ? product.description.substring(0, 80) + "..."
                            : product.description
                          : ""}
                      </p>
                      <div className="mt-auto flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="flex-1 text-center font-medium px-3 py-2 rounded-lg bg-blue-600 text-white text-sm transition hover:bg-blue-700"
                          >
                            View Details
                          </Link>
                        </div>
                        {/* Rating display */}
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-500 text-xs ml-1">
                            ({product.reviewsCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No featured products available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-amber-400 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Special Offers Just For You!
          </h2>
          <p className="text-white text-xl mb-6">
            Save up to 50% on selected items this week only
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Shop Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
