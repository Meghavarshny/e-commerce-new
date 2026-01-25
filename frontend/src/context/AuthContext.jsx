import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("authUser");
    return userData ? JSON.parse(userData) : null;
  });

  // Login: Save JWT and user info
  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      { email, password },
    );
    setUser(res.data.user);
    localStorage.setItem("authUser", JSON.stringify(res.data.user));
    localStorage.setItem("authToken", res.data.token);
  };

  // Logout: Clear everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  // Maybe: Fetch profile again on mount (if token)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
