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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">
            Overview for{" "}
            <span className="font-semibold">
              {user.restaurantName || user.name}
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={sellerProducts.length}
            label="Your Products"
            link="/seller/products"
            color="blue"
            icon="📦"
          />
          <StatCard
            value={sellerOrders.length}
            label="Total Orders"
            link="/seller/orders"
            color="green"
            icon="📊"
          />
          <StatCard
            value={`₹ ${totalSales.toFixed(2)}`}
            label="Total Revenue"
            color="purple"
            icon="💸"
          />
          <StatCard
            value={sellerProducts.filter((p) => p.stock > 0).length}
            label="Active Listings"
            color="yellow"
            icon="✅"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ActionCard
            title="Manage Products"
            icon="📝"
            description="Add or edit products"
            link="/seller/products"
            color="blue"
          />
          <ActionCard
            title="Manage Orders"
            icon="📋"
            description="Process incoming orders"
            link="/seller/orders"
            color="green"
          />
          <ActionCard
            title="Comp. Pricing"
            icon="📉"
            description="Analyze market prices"
            link="/seller/pricing"
            color="purple"
          />
          <ActionCard
            title="Seller Profile"
            icon="🏪"
            description="Store settings"
            link="/profile"
            color="indigo"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Sales
              </h3>
              <Link
                to="/seller/orders"
                className="text-blue-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            {sellerOrders.length > 0 ? (
              <div className="space-y-4">
                {sellerOrders.slice(0, 3).map((order) => {
                  const sellerItems = order.items.filter(
                    (item) =>
                      item.seller === user.id || item.seller === user._id,
                  );
                  const orderValue = sellerItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  );

                  return (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          #{order._id.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </div>
                        <div className="text-sm font-medium">
                          ₹ {orderValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent sales</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Top Products
              </h3>
              <Link
                to="/seller/products"
                className="text-blue-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            {sellerProducts.length > 0 ? (
              <div className="space-y-4">
                {sellerProducts.slice(0, 3).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={product.image || "https://placeholder.co/60x60"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded mr-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Stock: {product.stock || 0}
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      ₹ {product.price?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No products listed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, link, color, icon }) {
  const colorStyles = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  const CardContent = (
    <div className="flex items-center">
      <div className="text-2xl mr-4">{icon}</div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </div>
  );

  const className = `block rounded-xl border p-6 hover:shadow-md transition ${colorStyles[color] || colorStyles.blue}`;

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
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  };

  return (
    <Link
      to={link}
      className={`block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition text-center ${colorStyles[color] || colorStyles.blue} text-white`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </Link>
  );
}
