import useWishlist from "../hooks/useWishlist";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Wishlist</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlist?.length || 0} item{wishlist?.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {!wishlist || wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Items you save will appear here. Start adding products you like!</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            {/* Action buttons for wishlist */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-gray-600">
                Showing {wishlist?.length || 0} item{wishlist?.length !== 1 ? 's' : ''} in your wishlist
              </div>
              <button
                onClick={() => {
                  // Add a "Clear wishlist" action if needed
                  if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
                    // Implementation would go here
                  }
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Clear Wishlist
              </button>
            </div>

            {/* Wishlist items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist?.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative">
                  {/* Wishlist item actions */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition"
                      title="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Product card */}
                  <div className="p-4">
                    <div 
                      className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <h3 
                        className="font-semibold text-gray-800 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">₹ {product.price?.toFixed(2)}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="ml-2 text-sm text-gray-500 line-through">₹ {product.originalPrice?.toFixed(2)}</div>
                        )}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="ml-2 text-sm font-semibold text-green-600">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">({product.numReviews || 0})</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Add to cart functionality
                      }}
                      className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation section */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended for you</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist?.slice(0, 3).map(product => (
                  <div 
                    key={`rec-${product._id}`} 
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img 
                      src={product.image || "https://placeholder.co/60x60"} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 truncate">{product.name}</div>
                      <div className="text-sm text-gray-600">₹ {product.price?.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}