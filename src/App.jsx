import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Public Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Components
import AdminRoute from "./pages/admin/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageHotels from "./pages/admin/ManageHotels";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <div className="min-h-[calc(100vh-80px)] bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="hotels" element={<ManageHotels />} />
            </Route>
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
