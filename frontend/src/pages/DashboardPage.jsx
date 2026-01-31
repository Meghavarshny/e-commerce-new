import { useAuth } from "../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your dashboard.
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Routing Logic based on Role
  if (user.role === "seller") {
    return <SellerDashboard />;
  }

  // Default to Buyer Dashboard for buyers and others
  return <BuyerDashboard />;
}
