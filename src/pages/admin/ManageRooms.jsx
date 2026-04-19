import { useEffect, useState } from "react";
import {
  getAllRooms,
  deleteRoom,
  createRoom,
  updateRoom,
  checkRoomAvailability
} from "../../services/roomService";
import { getAllHotels } from "../../services/hotelService";
import toast from "react-hot-toast";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availability, setAvailability] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    capacity: "",
    description: "",
    hotel: "",
    images: [""]
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      const roomsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.rooms)
          ? data.rooms
          : [];

      setRooms(roomsData);
    } catch {
      toast.error("Failed to load rooms");
    }
    setLoading(false);
  };

const fetchHotels = async () => {
  try {
    const data = await getAllHotels();

    const hotelsData = Array.isArray(data)
      ? data
      : Array.isArray(data?.hotels)
        ? data.hotels
        : [];

    setHotels(hotelsData);

  } catch {
    toast.error("Failed to load hotels");
    setHotels([]); // IMPORTANT
  }
};

  const handleCheckAvailability = async (roomId) => {
    if (!checkIn || !checkOut) {
      toast.error("Select dates first");
      return;
    }

    try {
      const res = await checkRoomAvailability(roomId, checkIn, checkOut);

      setAvailability((prev) => ({
        ...prev,
        [roomId]: res
      }));

      res.available
        ? toast.success("Available ")
        : toast.error("Not available ");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="font-medium">Delete this room?</p>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteRoom(id);
              toast.success("Deleted");
              fetchRooms();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      images: formData.images.filter((img) => img.trim() !== "")
    };

    await createRoom(roomData);
    toast.success("Room created");
    setShowModal(false);
    resetForm();
    fetchRooms();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      images: formData.images.filter((img) => img.trim() !== "")
    };

    await updateRoom(editingRoom._id, roomData);
    toast.success("Updated");
    setShowModal(false);
    setEditingRoom(null);
    resetForm();
    fetchRooms();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      title: room.title,
      price: room.price,
      capacity: room.capacity,
      description: room.description,
      hotel: room.hotel?._id,
      images: room.images?.length ? room.images : [""]
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      capacity: "",
      description: "",
      hotel: "",
      images: [""]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-500">Manage your listings</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingRoom(null);
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-3 rounded-2xl shadow hover:scale-105 transition"
        >
          + Add Room
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex gap-3 mb-8">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow-sm"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white shadow-sm"
        />
      </div>

      {/* Rooms */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading rooms...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={room.images?.[0] || "/placeholder.jpg"}
                  className="w-full h-52 object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  ₹{room.price}/night
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-semibold">{room.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {room.description}
                </p>

                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>👤 {room.capacity}</span>
                  <span>{room.hotel?.name || "No hotel"}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>

                {/* Availability */}
                <button
                  onClick={() => handleCheckAvailability(room._id)}
                  className="w-full mt-3 bg-green-500 text-white py-2 rounded-xl"
                >
                  Check Availability
                </button>

                {availability[room._id] && (
                  <p
                    className={`mt-2 text-sm font-semibold ${availability[room._id].available
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {availability[room._id].available
                      ? "Available"
                      : "Not Available"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={editingRoom ? handleUpdate : handleCreate}
              className="p-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="text-sm text-gray-600">Room Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  placeholder="Deluxe King Room"
                  required
                />
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full mt-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="w-full mt-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                    required
                  />
                </div>
              </div>

              {/* Hotel */}
              <div>
                <label className="text-sm text-gray-600">Select Hotel</label>
                <select
                  value={formData.hotel}
                  onChange={(e) =>
                    setFormData({ ...formData, hotel: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  required
                >
                  <option value="">Choose hotel</option>
                  {hotels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                  placeholder="Describe the room..."
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-full border hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-black text-white hover:opacity-90 transition"
                >
                  {editingRoom ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}