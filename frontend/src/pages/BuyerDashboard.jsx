import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import useWishlist from "../hooks/useWishlist";
import { useState, useEffect } from "react";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      const sortedOrders = [...orders].sort(
        (a, b) =>
          new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id),
      );
      setRecentOrders(sortedOrders.slice(0, 3));
    }
  }, [orders]);

  const recentWishlist = wishlist?.slice(0, 3) || [];
  const totalSpent =
    orders?.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + item.price * item.quantity,
          0,
        ),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-transparent py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden group">
          <div className="relative z-10">
            <h1 className="text-4xl font-black tracking-tight mb-2">My Account</h1>
            <p className="text-emerald-50 text-lg opacity-90">
              Welcome back, <span className="font-bold underline decoration-2 underline-offset-4">{user.name}</span>! Ready for some shopping?
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute right-20 top-0 w-32 h-32 bg-emerald-400 rounded-full opacity-10 group-hover:-translate-y-5 transition-transform duration-500"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            value={orders?.length || 0}
            label="Total Orders"
            link="/orders"
            color="emerald"
            icon="🛍️"
          />
          <StatCard
            value={wishlist?.length || 0}
            label="Wishlist Items"
            link="/wishlist"
            color="pink"
            icon="❤️"
          />
          <StatCard
            value={orders?.filter((o) => o.status === "Delivered").length || 0}
            label="Delivered"
            color="teal"
            icon="✨"
          />
          <StatCard
            value={`₹ ${totalSpent.toFixed(2)}`}
            label="Total Spent"
            color="amber"
            icon="💎"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ActionCard
            title="My Orders"
            icon="📦"
            description="Track packages"
            link="/orders"
            color="emerald"
          />
          <ActionCard
            title="Wishlist"
            icon="💖"
            description="Saved items"
            link="/wishlist"
            color="pink"
          />
          <ActionCard
            title="Profile"
            icon="👤"
            description="Account settings"
            link="/profile"
            color="teal"
          />
          <ActionCard
            title="Explore"
            icon="🌈"
            description="Browse items"
            link="/products"
            color="amber"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Orders */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-emerald-50 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                Recent Orders
              </h3>
              <Link
                to="/orders"
                className="text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full transition-colors"
              >
                View All &rarr;
              </Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 hover:bg-emerald-50 transition-colors"
                  >
                    <div>
                      <div className="font-black text-gray-900">#{order._id.slice(-6)}</div>
                      <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block shadow-sm ${
                          order.status === "Delivered"
                            ? "bg-emerald-500 text-white"
                            : order.status === "Processing"
                              ? "bg-amber-500 text-white"
                              : order.status === "Shipped"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-500 text-white"
                        }`}
                      >
                        {order.status}
                      </div>
                      <div className="text-lg font-black text-gray-900">
                        ₹{" "}
                        {order.items
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                 <span className="text-4xl block mb-2">🛒</span>
                 <p className="text-gray-500 font-medium">No orders yet. Time to shop!</p>
              </div>
            )}
          </div>

          {/* Recent Wishlist */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-pink-50 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                Wishlist
              </h3>
              <Link
                to="/wishlist"
                className="text-pink-600 hover:text-pink-700 font-bold text-sm bg-pink-50 px-4 py-2 rounded-full transition-colors"
              >
                View All &rarr;
              </Link>
            </div>
            {recentWishlist.length > 0 ? (
              <div className="space-y-4">
                {recentWishlist.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center p-4 bg-pink-50/30 rounded-2xl border border-pink-100/50 hover:bg-pink-50 transition-colors"
                  >
                    <img
                      src={item.image || "https://placehold.jp/60x60"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl mr-5 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate text-lg">{item.name}</div>
                      <div className="text-pink-600 font-black">
                        ₹ {item.price?.toFixed(2)}
                      </div>
                    </div>
                    <button className="p-3 bg-white text-pink-500 rounded-full shadow-sm hover:bg-pink-500 hover:text-white transition-all">
                      🛒
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                 <span className="text-4xl block mb-2">💔</span>
                 <p className="text-gray-500 font-medium">Your wishlist is lonely.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, link, color, icon }) {
  const colorStyles = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100",
    pink: "bg-pink-50 border-pink-100 text-pink-700 hover:bg-pink-100",
    teal: "bg-teal-50 border-teal-100 text-teal-700 hover:bg-teal-100",
    amber: "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100",
  };

  const CardContent = (
    <div className="flex items-center gap-5">
      <div className="text-4xl filter drop-shadow-md">{icon}</div>
      <div>
        <div className="text-3xl font-black tracking-tighter">{value}</div>
        <div className="text-xs font-black uppercase tracking-widest opacity-70">{label}</div>
      </div>
    </div>
  );

  const className = `block rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 ${colorStyles[color] || colorStyles.emerald}`;

  if (link) {
    return (
      <Link to={link} className={className}>
        {CardContent}
      </Link>
    );
  }

  return <div className={className}>{CardContent}</div>;
}

function ActionCard({ title, icon, description, link, color }) {
  const colorStyles = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    pink: "bg-pink-600 hover:bg-pink-700 shadow-pink-200",
    teal: "bg-teal-600 hover:bg-teal-700 shadow-teal-200",
    amber: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
  };

  return (
    <Link
      to={link}
      className={`block rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 text-center text-white hover:-translate-y-2 active:scale-95 shadow-lg ${colorStyles[color] || colorStyles.emerald}`}
    >
      <div className="text-4xl mb-3 filter drop-shadow-md">{icon}</div>
      <h3 className="font-black text-lg leading-tight mb-1">{title}</h3>
      <p className="text-[10px] uppercase font-black tracking-widest opacity-80">{description}</p>
    </Link>
  );
}
