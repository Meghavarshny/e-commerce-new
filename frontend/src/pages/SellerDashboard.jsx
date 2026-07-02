import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import useProducts from "../hooks/useProducts";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { products } = useProducts();

  // Filter seller specific data
  const sellerProducts =
    products?.filter((p) => p.seller === user.id || p.seller === user._id) ||
    [];

  const sellerOrders =
    orders?.filter((order) =>
      order.items.some(
        (item) => item.seller === user.id || item.seller === user._id,
      ),
    ) || [];

  const totalSales = sellerOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) =>
          item.seller === user.id || item.seller === user._id
            ? itemSum + item.price * item.quantity
            : itemSum,
        0,
      ),
    0,
  );

  return (
    <div className="min-h-screen bg-transparent py-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Seller Console</h1>
            <p className="text-slate-500 font-medium mt-1">
              Performance overview for <span className="text-indigo-600 font-bold">{user.name}</span>
            </p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700">
                📅 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
             </div>
             <Link to="/seller/products" className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 text-sm font-bold hover:bg-indigo-700 transition">
                + New Product
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            value={sellerProducts.length}
            label="Inventory"
            link="/seller/products"
            color="slate"
            icon="📦"
          />
          <StatCard
            value={sellerOrders.length}
            label="Orders"
            link="/seller/orders"
            color="indigo"
            icon="📈"
          />
          <StatCard
            value={`₹${totalSales.toFixed(0)}`}
            label="Revenue"
            color="emerald"
            icon="💰"
          />
          <StatCard
            value={sellerProducts.filter((p) => (p.stock || 0) > 0).length}
            label="Active"
            color="amber"
            icon="🟢"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           {/* Recent Sales Table */}
           <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                 <Link to="/seller/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                       <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {sellerOrders.slice(0, 5).map(order => (
                          <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4 font-bold text-slate-700">#{order._id.slice(-6)}</td>
                             <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                             <td className="px-6 py-4 font-bold text-slate-900">₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                   order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                   {order.status}
                                </span>
                             </td>
                          </tr>
                       ))}
                       {sellerOrders.length === 0 && (
                          <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium">No transactions found</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Quick Actions Sidebar */}
           <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                 <h4 className="font-bold mb-4 text-indigo-400 uppercase text-xs tracking-widest">Store Actions</h4>
                 <div className="space-y-3">
                    <Link to="/seller/products" className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition group">
                       <span className="bg-slate-700 p-2 rounded-lg group-hover:bg-indigo-600 transition">📝</span>
                       <div className="text-sm">
                          <p className="font-bold">Add Products</p>
                          <p className="text-[10px] text-slate-400">Expand your inventory</p>
                       </div>
                    </Link>
                    <Link to="/seller/pricing" className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition group">
                       <span className="bg-slate-700 p-2 rounded-lg group-hover:bg-indigo-600 transition">📈</span>
                       <div className="text-sm">
                          <p className="font-bold">Pricing Tool</p>
                          <p className="text-[10px] text-slate-400">Analyze market rates</p>
                       </div>
                    </Link>
                 </div>
              </div>
              
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                 <h4 className="font-bold text-indigo-900 mb-2">Pro Tip</h4>
                 <p className="text-xs text-indigo-700 leading-relaxed">
                    Sellers who update their stock weekly see 25% more consistent sales. Keep your inventory fresh!
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, link, color, icon }) {
  const colorStyles = {
    slate: "bg-white border-slate-200 text-slate-900",
    indigo: "bg-white border-slate-200 text-indigo-600",
    emerald: "bg-white border-slate-200 text-emerald-600",
    amber: "bg-white border-slate-200 text-amber-600",
  };

  const CardContent = (
    <div className="flex flex-col">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</div>
    </div>
  );

  const className = `block rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${colorStyles[color] || colorStyles.slate}`;

  if (link) {
    return (
      <Link to={link} className={className}>
        {CardContent}
      </Link>
    );
  }

  return <div className={className}>{CardContent}</div>;
}
