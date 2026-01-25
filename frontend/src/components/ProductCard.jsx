import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image || FALLBACK_IMAGE}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          &#8377; {product.price}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {truncateText(product.description, 80)}
        </p>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-2">
            <Link
              to={`/products/${product._id}`}
              className="flex-1 text-center font-semibold px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition duration-200 text-sm"
            >
              View Details
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg active:scale-95"
              title="Add to cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l.586-1.172a2 2 0 012.32-1.173L10 10l2.059-4.118a2 2 0 012.32-1.173l1.358 5.43-.893.892L14.82 7.172A1 1 0 0014 8H6.414l-.305-1.222a.997.997 0 00-.01-.042L4.22 3H3a1 1 0 00-1-1z" />
              </svg>
            </button>
          </div>
          {/* Rating display */}
          <div className="flex items-center pt-2 border-t border-gray-50">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 4) ? "text-yellow-400" : "text-gray-200"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-xs ml-2 font-medium">
              ({product.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
