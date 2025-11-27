import { useEffect, useState } from "react";
import { getAllRooms, deleteRoom, createRoom, updateRoom } from "../../services/roomService";
import { getAllHotels } from "../../services/hotelService";
import toast from "react-hot-toast";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    capacity: "",
    description: "",
    hotel: "",
    images: [""]
  });

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Rooms error:", err);
      toast.error("Failed to load rooms");
    }
    setLoading(false);
  };

  const fetchHotels = async () => {
    try {
      const data = await getAllHotels();
      setHotels(data);
    } catch (err) {
      console.error("Hotels error:", err);
      toast.error("Failed to load hotels");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    try {
      await deleteRoom(id);
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        images: formData.images.filter(img => img.trim() !== "")
      };

      await createRoom(roomData);
      toast.success("Room created successfully");
      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        images: formData.images.filter(img => img.trim() !== "")
      };

      await updateRoom(editingRoom._id, roomData);
      toast.success("Room updated successfully");
      setShowModal(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      title: room.title || "",
      price: room.price || "",
      capacity: room.capacity || "",
      description: room.description || "",
      hotel: room.hotel?._id || "",
      images: room.images?.length > 0 ? room.images : [""]
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
    setEditingRoom(null);
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""]
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : [""]
    });
  };

  const updateImageField = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Rooms</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add New Room
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-gray-500">No rooms found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
            >
              <img
                src={room.images?.[0] || "/placeholder.jpg"}
                alt={room.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{room.title}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {room.description}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-blue-600">₹{room.price}/night</span>
                  <span className="text-sm text-gray-500">Capacity: {room.capacity}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Hotel: {room.hotel?.name || "N/A"}
                </p>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingRoom ? handleUpdate : handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Deluxe King Room"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Night (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="2999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel *
                    </label>
                    <select
                      required
                      value={formData.hotel}
                      onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Room description..."
                  />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Images
                    </label>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      + Add Image
                    </button>
                  </div>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingRoom ? "Update Room" : "Create Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}