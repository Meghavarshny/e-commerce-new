import { createContext, useContext, useEffect, useState } from "react";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";
import { useAuth } from "./AuthContext";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { notification, showSuccess } = useNotification();
  const [initialized, setInitialized] = useState(false);

  const [cart, setCart] = useState([]);

  // Load cart from localStorage for guests, or from backend for logged-in users
  useEffect(() => {
    if (initialized) return;
    if (user) {
      api.get("/cart").then((res) => {
        const serverCart = (res.data || []).map((item) => ({
          _id: item.product?._id || item.product,
          name: item.product?.name || "Unknown",
          price: item.price,
          image: item.product?.image || "",
          seller: item.product?.seller || item.seller,
          quantity: item.quantity,
        }));
        setCart(serverCart);
        localStorage.setItem("cart", JSON.stringify(serverCart));
        setInitialized(true);
      }).catch(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
          try { setCart(JSON.parse(saved)); } catch {}
        }
        setInitialized(true);
      });
    } else {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try { setCart(JSON.parse(saved)); } catch {}
      }
      setInitialized(true);
    }
  }, [user, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, initialized]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (user) api.put("/cart", { productId: product._id, quantity: newQty }).catch(() => {});
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item,
        );
      }
      if (user) api.post("/cart", { productId: product._id, quantity }).catch(() => {});
      return [...prev, { ...product, quantity }];
    });
    showSuccess(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    if (user) api.delete(`/cart/${productId}`).catch(() => {});
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item._id !== productId));
      if (user) api.delete(`/cart/${productId}`).catch(() => {});
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
    if (user) api.put("/cart", { productId, quantity: Math.max(1, quantity) }).catch(() => {});
  };

  const clearCart = () => {
    setCart([]);
    if (user) api.delete("/cart").catch(() => {});
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={notification.hideNotification}
        />
      )}
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
