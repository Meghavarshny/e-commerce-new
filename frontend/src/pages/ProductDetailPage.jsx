import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useNotification from "../hooks/useNotification";
import Loader from "../components/Loader";
import Review from "../components/Review";
import Notification from "../components/Notification";

import useOrders from "../hooks/useOrders";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading, error, refetch } = useApi(`/products/${id}`);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { orders } = useOrders(); // Fetch orders to verify purchase
  const { notification, showNotification, hideNotification, showError } =
    useNotification();
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Check if user has purchased the product
  const hasPurchased =
    user &&
    orders?.some((order) =>
      order.items.some((item) => {
        const productId =
          typeof item.product === "object" ? item.product._id : item.product;
        return productId === id;
      }),
    );

  useEffect(() => {
    if (product && user) {
      // Check if user has already reviewed this product
      const hasReviewed = product.reviews?.some(
        (review) => review.user._id === user._id,
      );
      setUserHasReviewed(hasReviewed);
    }
  }, [product, user]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Please login to submit a review", "error");
      return;
    }

    if (!hasPurchased) {
      showError("You must purchase this product to leave a review");
      return;
    }

    // Check if user has already reviewed
    if (userHasReviewed) {
      showError("You have already reviewed this product");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(newReview),
        },
      );

      const result = await response.json();

      if (response.ok) {
        showNotification("Review submitted successfully!");
        setNewReview({ rating: 5, comment: "" });
        refetch(); // Refresh the product data to include the new review
        setUserHasReviewed(true);
      } else {
        showError(result.message || "Failed to submit review");
      }
    } catch {
      showError("An error occurred while submitting your review");
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  return (
    <div className="container mx-auto py-8">
      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <img
              src={product.image || "https://placeholder.co/600x600"}
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "https://placeholder.co/600x600";
              }}
            />
          </div>
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
            {product.category || "General"}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${i < Math.floor(product.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {product.reviewsCount || 0} reviews
            </span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="text-3xl font-bold text-blue-600 mb-6">
            ₹ {product.price}
          </div>

          <button
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${i < Math.floor(product.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>

        {user && !userHasReviewed && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"} focus:outline-none`}
                    >
                      {star <= newReview.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {userHasReviewed && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
            <p className="text-blue-800">
              You have already reviewed this product. Thank you for your
              feedback!
            </p>
          </div>
        )}

        {!user && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
            <p className="text-gray-600">
              Please{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                login
              </a>{" "}
              to submit a review.
            </p>
          </div>
        )}

        <div>
          {product.reviews?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            product.reviews.map((rev) => <Review key={rev._id} review={rev} />)
          )}
        </div>
      </div>
    </div>
  );
}
