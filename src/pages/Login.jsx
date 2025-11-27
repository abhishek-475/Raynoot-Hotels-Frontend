import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHotel,
  FaArrowRight,
  FaUserPlus,
  FaShieldAlt
} from "react-icons/fa";

export default function Login() {
  const { setUserAfterLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      console.log(' Login component: Starting login...');

      const data = await loginUser({ email, password });
      console.log(' Login component: Response received:', data);

      // MANUALLY STORE THE TOKEN
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log(' Token stored in localStorage:', data.token.substring(0, 20) + '...');

        // Verify storage
        const storedToken = localStorage.getItem("token");
        console.log(' Token verification:', storedToken ? 'STORED' : 'MISSING');
      } else {
        console.error(' No token in response!');
      }

      // Save user in context
      setUserAfterLogin(data.user);

      toast.success(
        <div className="flex items-center space-x-2">
          <FaShieldAlt className="text-green-500" />
          <span>Welcome back! Login successful</span>
        </div>
      );
      navigate("/");
    } catch (err) {
      console.error('🔐 Login component: Error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || "Invalid credentials";
      toast.error(
        <div className="flex items-center space-x-2">
          <FaShieldAlt className="text-red-500" />
          <span>{errorMessage}</span>
        </div>
      );
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">

        {/* Left Side - Brand & Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm group-hover:bg-opacity-30 transition-all duration-300">
                <FaHotel className="text-2xl" />
              </div>
              <span className="text-2xl font-bold">Raynott Hotels</span>
            </Link>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome Back
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Sign in to your account and continue your journey with luxury accommodations worldwide.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-blue-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-sm" />
              </div>
              <span className="text-sm">Secure & Encrypted Login</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaHotel className="text-sm" />
              </div>
              <span className="text-sm">Access 500+ Luxury Hotels</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center space-x-1 group"
                >
                  <span>Sign up</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="text-green-500 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  Your login is secure and encrypted. We never share your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}