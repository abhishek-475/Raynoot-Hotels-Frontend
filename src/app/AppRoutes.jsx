import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import PageLoader from "../components/common/PageLoader";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Hotels from "../pages/Hotels";
import HotelDetails from "../pages/HotelDetails";
import Booking from "../pages/Booking";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Profile from "../pages/Profile";
import MyBookings from "../pages/MyBookings";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/common/ProtectedRoute";

import AdminRoute from "../pages/admin/AdminRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageRooms from "../pages/admin/ManageRooms";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageHotels from "../pages/admin/ManageHotels";
import BookingDetails from "../pages/BookingDetails";

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/hotels" element={<Hotels />} />
                    <Route path="/hotels/:id" element={<HotelDetails />} />
                    <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                    <Route
                        path="/booking/details/:id"
                        element={
                            <ProtectedRoute>
                                <BookingDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected */}
                    <Route
                        path="/bookings/my"
                        element={
                            <ProtectedRoute>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Admin */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="rooms" element={<ManageRooms />} />
                    <Route path="bookings" element={<ManageBookings />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="hotels" element={<ManageHotels />} />
                </Route>
            </Routes>
        </Suspense>
    );
}