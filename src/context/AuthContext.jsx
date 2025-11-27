import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(" AuthProvider mounted - Checking localStorage...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log(" Token from localStorage:", token ? "PRESENT" : "MISSING");
    // console.log(" User from localStorage:", storedUser ? "PRESENT" : "MISSING");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(' User loaded from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error(' Error parsing stored user:', error);
      }
    } else {
      console.log('ℹ️ No authentication data found in localStorage');
    }
    setLoading(false);
  }, []);

  const setUserAfterLogin = (userData) => {
    // console.log(' setUserAfterLogin called with:', userData);

    const userWithRole = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user"
    };

    console.log(' Storing user in localStorage:', userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));

    // Verify storage
    const storedUser = localStorage.getItem("user");
    console.log(' User stored in localStorage:', storedUser ? "SUCCESS" : "FAILED");

    setUser(userWithRole);
  };

  const login = async (email, password) => {
    try {
      console.log(' Starting login process...');
      console.log('Email:', email);

      const res = await loginUser({ email, password });
      console.log(' Login API response received');

      // Store token
      console.log(' Storing token...');
      localStorage.setItem("token", res.token);

      // Verify token storage
      const storedToken = localStorage.getItem("token");
      console.log(' Token storage verification:', storedToken ? "SUCCESS" : "FAILED");

      setUserAfterLogin(res.user);
      return res;
    } catch (error) {
      console.error(' Login failed:', error);
      console.error(' Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log(' localStorage cleared');
  };

  // Add these helper methods
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const hasUser = !!user;
    console.log(' isAuthenticated check - Token:', token ? 'PRESENT' : 'MISSING', 'User:', hasUser);
    return !!token && hasUser;
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

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

  const authContextValue = {
    user,
    login,
    logout,
    setUserAfterLogin,
    isAuthenticated: isAuthenticated(), // Call the function to get current value
    isAdmin: isAdmin(), // Call the function to get current value
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};