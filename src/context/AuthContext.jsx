import { createContext, useState, useEffect, useMemo } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const setUserAfterLogin = (userData) => {
    const userWithRole = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
    };

    localStorage.setItem("user", JSON.stringify(userWithRole));
    setUser(userWithRole);
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });

    localStorage.setItem("token", res.token);

    setUserAfterLogin(res.user);

    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const authContextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      setUserAfterLogin,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    }),
    [user]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};