import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function useCart() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setCart(response.data);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setCart(response.data);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(response.data);
      return { success: true };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to remove from cart",
      );
    }
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(response.data);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to clear cart");
    }
  };

  // Fetch cart when user logs in or changes
  useEffect(() => {
    if (user && user.role === "buyer") {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  };
}
