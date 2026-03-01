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
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Orders</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track your customer orders</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black border border-emerald-100">
           {orders.length} ACTIVE SALES
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
          <span className="text-5xl block mb-4">📭</span>
          <p className="text-slate-500 font-bold text-lg">You haven't made any sales yet.</p>
          <p className="text-slate-400 text-sm mt-1">Orders will appear here once customers purchase your products.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
               <div className="md:w-1/4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Order Reference</div>
                  <div className="text-xl font-black text-slate-900 mb-4">#{order._id.slice(-8)}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm ${
                    order.status === 'Delivered' ? 'bg-emerald-500 text-white' : 
                    order.status === 'Processing' ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'
                  }`}>
                    {order.status}
                  </div>
                  <div className="text-xs text-slate-400 font-bold">
                    Placed: {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
               </div>

               <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-6 md:pt-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Your Sold Items</div>
                  <div className="space-y-4">
                    {order.items
                      .filter((it) => it.seller === user.id || it.seller === user._id)
                      .map((item) => (
                        <div key={item.product} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                          <div>
                             <div className="font-bold text-slate-800">ID: {item.product}</div>
                             <div className="text-xs text-slate-500 mt-1">Quantity: <span className="font-bold text-slate-700">{item.quantity}</span></div>
                          </div>
                          <div className="text-right">
                             <div className="font-black text-slate-900">₹{item.price.toFixed(2)}</div>
                             <div className="text-[10px] text-slate-400 uppercase font-bold">Unit Price</div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-8 flex justify-between items-end border-t border-slate-100 pt-6">
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer Info</div>
                        <div className="text-sm font-bold text-slate-700">Ref: {order.buyer}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Total Revenue</div>
                        <div className="text-2xl font-black text-indigo-600">
                          ₹{order.items
                            .filter((it) => it.seller === user.id || it.seller === user._id)
                            .reduce((sum, item) => sum + item.price * item.quantity, 0)
                            .toFixed(2)}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
