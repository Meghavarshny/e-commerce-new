import { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const { api } = useApi();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch seller orders
  const fetchSellerOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      // Only orders which include at least one item from the current seller
      const filtered = res.data.filter((order) =>
        order.items.some(
          (it) => it.seller === user.id || it.seller === user._id,
        ),
      );
      setOrders(filtered);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [api, user]);

  useEffect(() => {
    if (user?.role === "seller") fetchSellerOrders();
  }, [user, fetchSellerOrders]);

  if (!user || user.role !== "seller") {
    return <div className="text-red-600">Not authorized.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Sales (Seller Orders)</h2>
      {loading && <Loader />}
      {orders.length === 0 && (
        <div className="text-gray-600">You have no orders yet.</div>
      )}
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="border rounded p-4 shadow bg-white">
            <div className="font-bold mb-1 text-blue-600">
              Order #{order._id.slice(-6)}
            </div>
            <div className="mb-2">Placed by: {order.buyer}</div>
            <div>
              Status: <span className="font-semibold">{order.status}</span>
            </div>
            <div className="mt-2 font-semibold">Order Items:</div>
            <ul className="list-disc ml-5">
              {order.items
                .filter((it) => it.seller === user.id || it.seller === user._id)
                .map((item) => (
                  <li key={item.product}>
                    Product: {item.product}, Qty: {item.quantity}, Price:
                    &#8377;{item.price}
                  </li>
                ))}
            </ul>
            <div className="text-xs text-gray-500 mt-3">
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
