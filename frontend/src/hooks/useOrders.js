import { useState, useEffect, useCallback } from "react";
import useApi from "./useApi";
import { useAuth } from "../context/AuthContext";

export default function useOrders() {
  const { api } = useApi();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [api, user]);

  const placeOrder = async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to place order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, placeOrder, refetch: fetchOrders };
}
