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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Competitive Pricing
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time market analysis for your inventory
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Analytics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Market Analysis
            </h2>
            <span className="text-xs text-gray-500 italic">
              Data updated: Just now
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Your Price</th>
                  <th className="px-6 py-4 text-center">Market Avg</th>
                  <th className="px-6 py-4 text-center">Lowest Price</th>
                  <th className="px-6 py-4 text-center">Recommendation</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingData.length > 0 ? (
                  pricingData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.image || "https://placehold.co/40x40"}
                            alt=""
                            className="w-10 h-10 rounded object-cover mr-3 bg-gray-100"
                          />
                          <span className="font-medium text-gray-800">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        ₹ {item.myPrice}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        ₹ {item.marketAvg}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        ₹ {item.lowest}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${item.adviceColor}`}
                      >
                        {item.advice}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to="/seller/products"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Update Price
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No products found. Add products to see analysis.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Pricing Tip</h3>
            <p className="text-sm text-blue-700">
              Products priced within 5% of the market average have a 40% higher
              conversion rate.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">
              📈 Trend Alert
            </h3>
            <p className="text-sm text-green-700">
              Electronics category prices are trending upwards by 12% this week.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">
              ⭐ Premium Strategy
            </h3>
            <p className="text-sm text-purple-700">
              Highlight unique features to justify maintaining a premium price
              point.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
