import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showNotification("Login successful!");
      navigate("/");
    } catch {
      showNotification("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>
        {notification && (
          <Notification {...notification} onClose={hideNotification} />
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
            autoComplete="current-password"
            placeholder="Password"
            required
            className="block w-full border border-gray-200 p-3 rounded focus:border-blue-600 transition text-black"
            value={form.password}
            onChange={onChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded font-semibold transition text-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-black">
          Don&rsquo;t have an account?{" "}
          <a className="text-blue-800 underline" href="/register">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
