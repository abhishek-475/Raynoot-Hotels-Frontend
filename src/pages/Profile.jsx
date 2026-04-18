import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaCrown,
  FaSignOutAlt,
  FaEdit,
  FaSave
} from "react-icons/fa";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-48 relative">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 border"
        >
          <div className="grid md:grid-cols-3 gap-10">

            {/* LEFT SIDE */}
            <div className="text-center">

              {/* AVATAR */}
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {user?.role === "admin" && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full shadow">
                    <FaCrown className="text-white text-sm" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                {user?.name}
              </h2>

              <p className="text-gray-500 text-sm">
                {user?.email}
              </p>

              <span className="inline-block mt-3 text-xs font-semibold px-4 py-1 rounded-full bg-gray-100 text-gray-700">
                {user?.role === "admin" ? "Administrator" : "Member"}
              </span>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl transition"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>

            {/* RIGHT SIDE */}
            <div className="md:col-span-2">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-sm font-medium bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                >
                  {isEditing ? <FaSave /> : <FaEdit />}
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-5">

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      defaultValue={user?.name}
                      readOnly={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                        isEditing
                          ? "bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
                          : "bg-gray-100 border-transparent"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      defaultValue={user?.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-transparent"
                    />
                  </div>
                </div>

              </div>

              {/* EXTRA INFO SECTION */}
              <div className="mt-10 p-6 rounded-2xl bg-gray-50 border">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Account Info
                </h4>
                <p className="text-sm text-gray-500">
                  Your account is active and verified. You can manage your bookings and profile details here.
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}