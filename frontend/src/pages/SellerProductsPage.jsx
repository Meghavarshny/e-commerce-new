import { useState, useEffect, useCallback } from "react";
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
          (prod) => prod.seller === user.id || prod.seller === user._id,
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
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Your Products (Seller)</h2>
      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}

      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="border p-4 rounded bg-white shadow mb-8 flex flex-col gap-3 max-w-xl"
      >
        <input
          name="name"
          placeholder="Product Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input input-bordered"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input input-bordered"
        />
        <input
          name="price"
          type="number"
          min="0"
          placeholder="Price (₹)"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="input input-bordered"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image || ""}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="input input-bordered"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category || ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="input input-bordered"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            type="button"
            className="text-red-500 mt-2"
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
            Cancel Edit
          </button>
        )}
      </form>

      {loading && <Loader />}
      {products.length === 0 && (
        <div className="text-gray-600">
          No products found. Use the form above to add one.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="border rounded p-4 shadow bg-white flex flex-col gap-2"
          >
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h3 className="font-bold">{prod.name}</h3>
            <div className="text-gray-600">{prod.description}</div>
            <div className="font-mono text-blue-800">&#8377; {prod.price}</div>
            <div className="text-xs text-gray-500">{prod.category}</div>
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-blue"
                onClick={() => handleEditInit(prod)}
              >
                Edit
              </button>
              <button
                className="btn btn-red"
                onClick={() => handleDelete(prod._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
