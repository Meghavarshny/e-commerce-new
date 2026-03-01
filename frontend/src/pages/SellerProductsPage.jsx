import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import useNotification from "../hooks/useNotification";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { api } = useApi();
  const { notification, showNotification, hideNotification } =
    useNotification();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch own products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(
        res.data.filter(
          (prod) =>
            // Robust check: match string or object IDs, handle potential undefined
            (prod.seller &&
              (prod.seller === user.id || prod.seller === user._id)) ||
            // Fallback: If product has NO seller (orphan), show it to allow claiming
            !prod.seller,
        ),
      );
    } catch {
      showNotification("Failed to load products", "error");
    }
    setLoading(false);
  }, [api, user, showNotification]);

  useEffect(() => {
    if (user?.role === "seller") fetchProducts();
  }, [user, fetchProducts]);

  // Add new product
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", form);
      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
      showNotification("Product added!");
      fetchProducts();
    } catch (err) {
      showNotification(
        err?.response?.data?.message || "Failed to add product",
        "error",
      );
    }
    setLoading(false);
  };

  // Edit product: load details to form
  const handleEditInit = (prod) => {
    setEditingId(prod._id);
    setForm(prod);
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/products/${editingId}`, form);
      setEditingId(null);
      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
      showNotification("Product updated!");
      fetchProducts();
    } catch (err) {
      showNotification(err?.response?.data?.message || "Edit failed", "error");
    }
    setLoading(false);
  };

  // Delete product
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      showNotification("Product deleted!");
      fetchProducts();
    } catch {
      showNotification("Delete failed", "error");
    }
    setLoading(false);
  };

  if (!user || user.role !== "seller") {
    return <div className="text-red-600">Not authorized.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 border-b-2 border-indigo-100 pb-4">
        <h2 className="text-3xl font-bold text-indigo-900">Manage Products</h2>
        <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          {products.length} Products
        </span>
      </div>

      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <form
              onSubmit={editingId ? handleUpdate : handleAdd}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Product details..."
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    name="category"
                    placeholder="e.g. Electronics"
                    value={form.category || ""}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  name="image"
                  placeholder="https://..."
                  value={form.image || ""}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg translate-y-0 active:translate-y-0.5"
                  }`}
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Add Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        name: "",
                        description: "",
                        price: "",
                        image: "",
                        category: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Product List */}
        <div className="lg:col-span-2">
          {loading && !products.length ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                  <span className="text-4xl block mb-4">📦</span>
                  <p>You haven't added any products yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod._id}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={
                            prod.image ||
                            "https://placehold.co/400x300?text=No+Image"
                          }
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold shadow-sm">
                          ₹{prod.price}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 truncate flex-1 pr-2">
                            {prod.name}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {prod.category || "General"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                          {prod.description || "No description provided."}
                        </p>

                        <div className="flex gap-2 border-t border-gray-100 pt-3">
                          <Link
                            to={`/products/${prod._id}`}
                            className="flex-1 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition text-center"
                            target="_blank"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleEditInit(prod)}
                            className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
