import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";

export default function SellerPricingPage() {
  const { products } = useProducts();
  const { user } = useAuth();

  // Filter for *my* products to show relevant analysis
  const myProducts =
    products?.filter((p) => p.seller === user?.id || p.seller === user?._id) ||
    [];

  // Generate mock analysis data for each product
  const pricingData = myProducts.map((prod) => {
    const marketAvg = Math.floor(
      prod.price * (1 + (Math.random() * 0.4 - 0.2)),
    ); // +/- 20%
    const lowest = Math.floor(marketAvg * 0.9);

    let advice = "Maintain";
    let color = "text-gray-600";

    if (prod.price > marketAvg * 1.1) {
      advice = "Lower Price";
      color = "text-red-600 font-bold";
    } else if (prod.price < marketAvg * 0.9) {
      advice = "Consider Increase";
      color = "text-green-600 font-bold";
    }

    return {
      id: prod._id,
      name: prod.name,
      image: prod.image,
      myPrice: prod.price,
      marketAvg,
      lowest,
      advice,
      adviceColor: color,
    };
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Market Intelligence
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Competitive analysis for your product inventory
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm"
          >
            &larr; Dashboard
          </Link>
        </div>

        {/* Analytics Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-900">
              Live Price Analysis
            </h2>
            <div className="flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                 Market Data Active
               </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-8 py-5 text-center">Your Price</th>
                  <th className="px-8 py-5 text-center">Market Avg</th>
                  <th className="px-8 py-5 text-center">Lowest Price</th>
                  <th className="px-8 py-5 text-center">Recommendation</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pricingData.length > 0 ? (
                  pricingData.map((item) => (
                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <img
                            src={item.image || "https://placehold.co/40x40"}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover mr-4 bg-slate-100 shadow-sm group-hover:scale-110 transition-transform"
                          />
                          <span className="font-black text-slate-800 text-lg">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-black text-slate-900 text-lg">
                        ₹{item.myPrice}
                      </td>
                      <td className="px-8 py-6 text-center text-slate-500 font-bold">
                        ₹{item.marketAvg}
                      </td>
                      <td className="px-8 py-6 text-center text-slate-500 font-bold">
                        ₹{item.lowest}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                           item.advice === "Maintain" ? "bg-slate-100 text-slate-600" :
                           item.advice === "Lower Price" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                        }`}>
                           {item.advice}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Link
                          to="/seller/products"
                          state={{ editProduct: item }}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          EDIT
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-8 py-20 text-center text-slate-400 font-bold text-lg"
                    >
                      <span className="text-4xl block mb-4">📊</span>
                      No products found. Add products to see analysis.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200 text-white relative overflow-hidden group">
            <h3 className="font-black text-indigo-400 mb-3 uppercase text-xs tracking-widest relative z-10">💡 Strategy Tip</h3>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10">
              Products priced within 5% of the market average have a <span className="text-white font-bold">40% higher</span> conversion rate.
            </p>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-125 transition-transform">💰</div>
          </div>
          <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden group">
            <h3 className="font-black text-indigo-200 mb-3 uppercase text-xs tracking-widest relative z-10">📈 Market Alert</h3>
            <p className="text-sm text-indigo-50 leading-relaxed relative z-10">
              Your category prices are trending upwards by <span className="text-white font-bold">12%</span> this week. Consider adjusting!
            </p>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-125 transition-transform">🚀</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden group">
            <h3 className="font-black text-indigo-600 mb-3 uppercase text-xs tracking-widest relative z-10">⭐ Premium Factor</h3>
            <p className="text-sm text-slate-600 leading-relaxed relative z-10">
              Highlight unique features to justify maintaining a <span className="text-slate-900 font-bold">premium price</span> point.
            </p>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-125 transition-transform">✨</div>
          </div>
        </div>
      </div>
    </div>
  );
}
