import { useEffect, useState } from "react";
import {
  getAllHotels,
  deleteHotel,
  createHotel,
  updateHotel
} from "../../services/hotelService";
import {
  FaHotel,
  FaStar,
  FaMapMarkerAlt,
  FaPlus
} from "react-icons/fa";

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const [notification, setNotification] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    stars: 3,
    pricePerNight: "",
    amenities: [],
    images: [""]
  });

  const [newAmenity, setNewAmenity] = useState("");

  // 🔔 Notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch
  const fetchHotels = async () => {
    try {
      const data = await getAllHotels();
      setHotels(data);
      showNotification("Hotels loaded");
    } catch {
      showNotification("Failed to load hotels", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Delete
  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteHotel(confirmDeleteId);
      showNotification("Hotel deleted");
      fetchHotels();
    } catch {
      showNotification("Delete failed", "error");
    }
    setConfirmDeleteId(null);
  };

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createHotel({
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        stars: Number(formData.stars),
        images: formData.images.filter((i) => i),
      });

      showNotification("Hotel created");
      setShowModal(false);
      resetForm();
      fetchHotels();
    } catch {
      showNotification("Create failed", "error");
    }
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateHotel(editingHotel._id, {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        stars: Number(formData.stars),
        images: formData.images.filter((i) => i),
      });

      showNotification("Hotel updated");
      setShowModal(false);
      resetForm();
      fetchHotels();
    } catch {
      showNotification("Update failed", "error");
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      ...hotel,
      images: hotel.images?.length ? hotel.images : [""],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      stars: 3,
      pricePerNight: "",
      amenities: [],
      images: [""],
    });
    setEditingHotel(null);
  };

  // UI helpers
  const renderStars = (stars) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < stars ? "text-yellow-400" : "text-gray-300"}
      />
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">Hotels</h1>
          <p className="text-gray-500">Premium management dashboard</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-400 text-white px-6 py-3 rounded-2xl shadow hover:scale-105 transition"
        >
          <FaPlus />
          Add Hotel
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="group bg-white rounded-3xl shadow hover:shadow-xl transition hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className="relative">
                <img
                  src={hotel.images?.[0]}
                  className="h-56 w-full object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full flex gap-1">
                  {renderStars(hotel.stars)}
                </div>

                <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 rounded">
                  ₹{hotel.pricePerNight}
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-semibold">{hotel.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FaMapMarkerAlt /> {hotel.city}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(hotel)}
                    className="flex-1 bg-black text-white py-2 rounded-xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingHotel ? "Edit Hotel" : "Add Hotel"}
            </h2>

            <form onSubmit={editingHotel ? handleUpdate : handleCreate}>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-premium mb-2"
              />

              <input
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="input-premium mb-2"
              />

              <input
                placeholder="Price"
                type="number"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerNight: e.target.value,
                  })
                }
                className="input-premium mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>

                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-3xl text-center">
            <p>Delete this hotel?</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6">
          <div
            className={`px-4 py-2 rounded-xl shadow 
            ${
              notification.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}