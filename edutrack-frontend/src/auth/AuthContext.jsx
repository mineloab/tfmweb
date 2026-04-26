import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario autenticado
  async function loadMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Login
  async function login(email, password) {
    setLoading(true);
    const { data } = await api.post("/auth/login", { email, password });

    // Guardar token
    localStorage.setItem("token", data.token);

    // MUY IMPORTANTE: aplicar el token inmediatamente a este axios instance
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    // Cargar usuario
    await loadMe();
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }

  // Al arrancar: si hay token guardado, lo aplicamos y pedimos /me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}