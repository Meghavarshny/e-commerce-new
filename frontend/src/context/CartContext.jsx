import { createContext, useContext, useEffect, useState } from "react";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const { notification, showSuccess } = useNotification();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) =>
      prev.some((item) => item._id === product._id)
        ? prev.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...prev, { ...product, quantity }],
    );
    showSuccess(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

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
