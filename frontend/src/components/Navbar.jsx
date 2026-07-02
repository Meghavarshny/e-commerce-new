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
    <nav className="bg-white/95 backdrop-blur-md border-b-2 border-emerald-500 sticky top-0 z-50 transition-all duration-300 shadow-sm shadow-emerald-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition"
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
              className="text-2xl font-black tracking-tighter text-emerald-700 ml-2"
            >
              ECO<span className="text-emerald-500">MM</span>
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-emerald-700"
            >
              ECO<span className="text-emerald-500">MM</span>
            </Link>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-gray-700 hover:text-emerald-700 font-semibold transition-colors px-1 py-1 ${isActive ? "text-emerald-700 border-b-2 border-emerald-500" : ""}`
              }
              onClick={handleLinkClick}
            >
              Shop
            </NavLink>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className={`${isMenuOpen ? "hidden md:flex" : "flex"} flex-1 max-w-lg mx-8`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for items..."
                className="w-full px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition shadow-md active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">🛒</span>
                  <span>Cart</span>
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">🏠</span>
                  <span>Account</span>
                </NavLink>
              </>
            )}

            {user?.role === "buyer" && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">🛒</span>
                  <span>Cart</span>
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">📦</span>
                  <span>Orders</span>
                </NavLink>
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">❤️</span>
                  <span>Wishlist</span>
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-medium transition-colors ${isActive ? "text-emerald-700" : "text-gray-600 hover:text-emerald-700"}`
                  }
                >
                  <span className="text-xl">🏠</span>
                  <span>Account</span>
                </NavLink>
              </>
            )}

            {user?.role === "seller" && (
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700"
              >
                <span className="text-xl">📊</span>
                <span>Console</span>
              </NavLink>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${user.role === 'seller' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition shadow-md hover:shadow-lg active:scale-95"
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
