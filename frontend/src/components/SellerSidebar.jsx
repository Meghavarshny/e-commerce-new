import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerSidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Products", path: "/seller/products", icon: "📦" },
    { name: "Orders", path: "/seller/orders", icon: "💰" },
    { name: "Pricing", path: "/seller/pricing", icon: "📈" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:flex flex-col fixed left-0 top-0 z-40 shadow-xl border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-indigo-400">Seller Hub</h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Store Manager</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold uppercase shadow-inner">
            {user?.name?.[0] || "S"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate leading-none mb-1">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold text-sm shadow-sm"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
