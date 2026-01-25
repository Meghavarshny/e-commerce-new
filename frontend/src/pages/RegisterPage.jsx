import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, form);
      showNotification(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      // Handle different error scenarios
      let errorMessage = "Registration failed";
      
      if (err.response) {
        // Server responded with error status
        const { data, status } = err.response;
        
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.errors && Array.isArray(data.errors)) {
          // Handle validation errors array
          errorMessage = data.errors.join(', ');
        } else {
          switch (status) {
            case 400:
              errorMessage = "Invalid registration data provided";
              break;
            case 409:
              errorMessage = "Email already exists";
              break;
            case 500:
              errorMessage = "Server error occurred during registration";
              break;
            default:
              errorMessage = `Registration failed (${status})`;
          }
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: Unable to connect to server";
      } else {
        // Something else happened
        errorMessage = `Request error: ${err.message}`;
      }
      
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Register</h2>
        {notification && (
          <Notification {...notification} onClose={hideNotification} />
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="block w-full border border-gray-200 p-3 rounded focus:border-blue-600 transition text-black"
            value={form.name}
            onChange={onChange}
          />
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            required
            className="block w-full border border-gray-200 p-3 rounded focus:border-blue-600 transition text-black"
            value={form.email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            required
            className="block w-full border border-gray-200 p-3 rounded focus:border-blue-600 transition text-black"
            value={form.password}
            onChange={onChange}
          />
          <select
            name="role"
            className="block w-full border border-gray-200 p-3 rounded focus:border-blue-600 transition text-black"
            value={form.role}
            onChange={onChange}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded font-semibold transition text-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <a className="text-blue-800 underline" href="/login">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
