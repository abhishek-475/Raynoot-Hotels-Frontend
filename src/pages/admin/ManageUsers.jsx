import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/authService";
import toast from "react-hot-toast";
import { FaUsers, FaTrash, FaUserShield } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Users error:", err);
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 const handleDelete = (id) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-white/90 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-4`}
    >
      <p className="text-gray-900 font-semibold mb-2">
        Delete this user?
      </p>
      <p className="text-gray-500 text-sm mb-4">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-1.5 text-sm rounded-lg border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            toast.dismiss(t.id);

            const loadingToast = toast.loading("Deleting user...");

            try {
              await deleteUser(id);
              toast.dismiss(loadingToast);
              toast.success("User deleted successfully ✨");
              fetchUsers();
            } catch (err) {
              toast.dismiss(loadingToast);
              toast.error("Delete failed");
            }
          }}
          className="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  ));
};

  const getRoleBadge = (role) => {
    const styles = {
      admin:
        "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm",
      user:
        "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers className="text-blue-600" />
            Users
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all registered users
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {users.length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Regular Users</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">
            {users.filter((u) => u.role === "user").length}
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow border">
          <div className="text-center">
            <FaUsers className="text-5xl text-gray-400 mb-3 mx-auto" />
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow border overflow-hidden">
          
          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* User */}
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">
                      {user.name}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="p-4 text-gray-600">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    {user.role === "admin" ? (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FaUserShield />
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}