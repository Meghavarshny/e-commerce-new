import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SellerProductsPage from "./pages/SellerProductsPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerPricingPage from "./pages/SellerPricingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.add("bg-gray-50");
    return () => document.body.classList.remove("bg-gray-50");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Buyer Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute roles={["buyer"]}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute roles={["buyer"]}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute roles={["buyer"]}>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute roles={["buyer"]}>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />

                {/* Common Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute roles={["buyer", "seller"]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute roles={["buyer", "seller"]}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Seller Routes */}
                <Route
                  path="/seller/products"
                  element={
                    <ProtectedRoute roles={["seller"]}>
                      <SellerProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute roles={["seller"]}>
                      <SellerOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/pricing"
                  element={
                    <ProtectedRoute roles={["seller"]}>
                      <SellerPricingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <LoginPage />}
                />
                <Route
                  path="/register"
                  element={user ? <Navigate to="/" /> : <RegisterPage />}
                />

                <Route
                  path="*"
                  element={
                    <div className="container mx-auto py-12 text-center text-red-600">
                      404 - Not Found
                    </div>
                  }
                />
              </Routes>
            </AnimatePresence>
          </div>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
