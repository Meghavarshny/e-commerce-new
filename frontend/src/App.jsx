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
import PaymentConfirmationPage from "./pages/PaymentConfirmationPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerPricingPage from "./pages/SellerPricingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import SellerSidebar from "./components/SellerSidebar";

const queryClient = new QueryClient();

function App() {
  const { user } = useAuth();
  const isSeller = user?.role === "seller";

  useEffect(() => {
    // Dynamic background and themes based on user role
    const role = user?.role;
    
    // Clear all existing theme-related body classes
    const classesToRemove = [
      "bg-white", "bg-blue-50/30", "bg-indigo-50/30", "bg-gray-50", 
      "bg-emerald-50/20", "bg-slate-50", "theme-buyer", "theme-seller"
    ];
    document.body.classList.remove(...classesToRemove);
    
    if (role === "buyer") {
      document.body.classList.add("bg-emerald-50/20", "theme-buyer"); 
    } else if (role === "seller") {
      document.body.classList.add("bg-slate-50", "theme-seller"); 
    } else {
      document.body.classList.add("bg-white"); 
    }
    
    return () => {
      document.body.classList.remove(...classesToRemove);
    };
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen flex ${isSeller ? "flex-row" : "flex-col"}`}>
          {isSeller ? (
            <>
              <SellerSidebar />
                <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <main className="flex-1 p-4 md:p-8">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/dashboard" element={<SellerDashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/seller/products" element={<SellerProductsPage />} />
                      <Route path="/seller/orders" element={<SellerOrdersPage />} />
                      <Route path="/seller/pricing" element={<SellerPricingPage />} />
                      
                      {/* Redirect ALL buyer-specific paths to seller dashboard if logged in as seller */}
                      <Route path="/cart" element={<Navigate to="/dashboard" />} />
                      <Route path="/checkout" element={<Navigate to="/dashboard" />} />
                      <Route path="/orders" element={<Navigate to="/seller/orders" />} />
                      <Route path="/wishlist" element={<Navigate to="/dashboard" />} />
                      <Route path="/products" element={<Navigate to="/seller/products" />} />
                      
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>
            </>
          ) : (
            <>
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
                      path="/payment-confirmation"
                      element={
                        <ProtectedRoute roles={["buyer"]}>
                          <PaymentConfirmationPage />
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

                    {/* Common Protected Routes for Buyers (Sellers handled above) */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute roles={["buyer"]}>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute roles={["buyer"]}>
                          <ProfilePage />
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
                        <div className="container mx-auto py-12 text-center text-red-600 font-bold">
                          404 - Not Found
                        </div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </div>
              <Footer />
            </>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
