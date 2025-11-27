import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("AuthProvider mounted - Checking localStorage...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // console.log(" Token from localStorage:", token);
    // console.log(" User from localStorage:", storedUser);

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log(' User loaded from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error(' Error parsing stored user:', error);
      }
    } else {
      console.log(' No authentication data found in localStorage');
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

    // console.log(' Storing user in localStorage:', userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));

    // Verify storage
    const storedUser = localStorage.getItem("user");
    // console.log(' User stored in localStorage:', storedUser);

    setUser(userWithRole);
  };

  const login = async (email, password) => {
    try {
      // console.log(' Starting login process...');
      // console.log(' Email:', email);

      const res = await loginUser({ email, password });
      // console.log(' Login API response:', res);

      // Store token
      console.log(' Storing token:', res.token);
      localStorage.setItem("token", res.token);

      // Verify token storage
      const storedToken = localStorage.getItem("token");
      // console.log(' Token stored in localStorage:', storedToken);

      setUserAfterLogin(res.user);
      return res;
    } catch (error) {
      console.error(' Login failed:', error);
      console.error(' Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    // console.log('🚪 Logging out...');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log(' localStorage cleared');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUserAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
};