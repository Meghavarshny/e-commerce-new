import { useState, useEffect, useCallback } from "react";
import useApi from "./useApi";

export default function useWishlist() {
  const { api } = useApi();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/wishlist");
      setWishlist(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const addToWishlist = async (productId) => {
    try {
      await api.post(`/wishlist/${productId}`);
      await fetchWishlist();
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to add to wishlist",
      );
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    refetch: fetchWishlist,
  };
}
