import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useWishlist from "../hooks/useWishlist";

export default function WishlistButton({ productId }) {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, refetch } =
    useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Fetch wishlist when component mounts
  useEffect(() => {
    if (user && user.role === "buyer") {
      refetch();
    }
  }, [user, refetch]); // Now it's safe to include refetch in the dependency array

  // Check if product is in wishlist
  const inWishlist = wishlist?.some((item) => {
    // Handle different ID formats
    const itemId = item._id || item.id || item.productId;
    const targetId = productId;
    return itemId === targetId;
  });

  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (!user || user.role !== "buyer") {
    return null;
  }

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isWishlistLoading}
      className={`absolute top-2 left-2 p-1.5 rounded-full transition ${
        inWishlist
          ? "bg-red-500 text-white"
          : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${isWishlistLoading ? "animate-pulse" : ""}`}
        viewBox="0 0 20 20"
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
