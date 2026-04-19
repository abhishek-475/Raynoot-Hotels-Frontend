import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <FaTimes className="text-gray-700 text-xl" />
              ) : (
                <FaBars className="text-gray-700 text-xl" />
              )}
            </button>

            {/* Mobile Header Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h2 className="text-sm font-bold text-gray-900">Raynott Admin</h2>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}