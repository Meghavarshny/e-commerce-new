import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search after navigating
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-700 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-blue-700 ml-2"
            >
              E-Commerce
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-blue-700"
            >
              E-Commerce
            </Link>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-gray-700 mx-3 hover:text-blue-700 font-medium ${isActive ? "text-blue-700" : ""}`
              }
              onClick={handleLinkClick}
            >
              Products
            </NavLink>
          </div>

          {/* Search Form - Hidden on mobile when menu is open */}
          <form
            onSubmit={handleSearch}
            className={`${isMenuOpen ? "hidden md:flex" : "flex"} flex-1 max-w-xl mx-4 md:mx-6`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Common Links */}
            {user?.role !== "seller" && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `hover:text-blue-700 text-gray-700 ${isActive ? "text-blue-700" : ""}`
                  }
                >
                  Cart
                </NavLink>
                {/* Wishlist only for logged in buyers (or users with no role yet, assuming buyer) */}
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `hover:text-blue-700 text-gray-700 ${isActive ? "text-blue-700" : ""}`
                  }
                >
                  Wishlist
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `hover:text-blue-700 text-gray-700 ${isActive ? "text-blue-700" : ""}`
                  }
                >
                  Orders
                </NavLink>
              </>
            )}

            {/* Seller Specific Links */}
            {user?.role === "seller" && (
              <>
                <NavLink
                  to="/seller/pricing"
                  className={({ isActive }) =>
                    `hover:text-blue-700 text-gray-700 ${isActive ? "text-blue-700" : ""}`
                  }
                >
                  Pricing
                </NavLink>
              </>
            )}

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:text-blue-700 text-gray-700 ${isActive ? "text-blue-700" : ""}`
              }
            >
              Dashboard
            </NavLink>

            {user ? (
              <>
                <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="ml-2 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-1 border border-blue-700 hover:bg-blue-700 hover:text-white rounded font-medium text-blue-700 transition"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                  }
                  onClick={handleLinkClick}
                >
                  Products
                </NavLink>

                {/* Mobile Links for Buyers */}
                {user?.role !== "seller" && (
                  <>
                    <NavLink
                      to="/cart"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                      }
                      onClick={handleLinkClick}
                    >
                      Cart
                    </NavLink>
                    <NavLink
                      to="/wishlist"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                      }
                      onClick={handleLinkClick}
                    >
                      Wishlist
                    </NavLink>
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                      }
                      onClick={handleLinkClick}
                    >
                      Orders
                    </NavLink>
                  </>
                )}

                {/* Mobile Links for Sellers */}
                {user?.role === "seller" && (
                  <>
                    <NavLink
                      to="/seller/pricing"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                      }
                      onClick={handleLinkClick}
                    >
                      Pricing
                    </NavLink>
                  </>
                )}

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"}`
                  }
                  onClick={handleLinkClick}
                >
                  Dashboard
                </NavLink>

                {/* User Actions */}
                {user ? (
                  <div className="flex flex-col gap-2">
                    <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
                      {user.name}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    className="px-4 py-2 border border-blue-700 text-blue-700 rounded-lg text-center"
                    onClick={handleLinkClick}
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
