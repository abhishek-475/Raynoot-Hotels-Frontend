import { useEffect, useState } from "react";
import {
  getAllHotels,
  deleteHotel,
  createHotel,
  updateHotel
} from "../../services/hotelService";
import { FaPlus, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

/* ================= MAIN PAGE ================= */

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

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

  useEffect(() => {
    fetchHotels();
  }, []);

  /* ================= FETCH ================= */

const fetchHotels = async () => {
  try {
    setLoading(true);

    const data = await getAllHotels();

    const hotelsData = Array.isArray(data)
      ? data
      : Array.isArray(data?.hotels)
        ? data.hotels
        : [];

    setHotels(hotelsData);

  } catch {
    toast.error("Failed to load hotels");
    setHotels([]);
  } finally {
    setLoading(false);
  }
};

  /* ================= FORM RESET ================= */

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
      images: [""]
    });
    setEditingHotel(null);
    setNewAmenity("");
  };

  /* ================= CREATE ================= */

  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      stars: Number(formData.stars),
      pricePerNight: Number(formData.pricePerNight),
      images: formData.images.filter((i) => i.trim())
    };

    try {
      await createHotel(payload);
      toast.success("Hotel created");
      setShowModal(false);
      resetForm();
      fetchHotels();
    } catch {
      toast.error("Create failed");
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      stars: Number(formData.stars),
      pricePerNight: Number(formData.pricePerNight),
      images: formData.images.filter((i) => i.trim())
    };

    try {
      await updateHotel(editingHotel._id, payload);
      toast.success("Hotel updated");
      setShowModal(false);
      resetForm();
      fetchHotels();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete hotel?")) return;

    try {
      await deleteHotel(id);
      toast.success("Deleted");
      fetchHotels();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);

    setFormData({
      ...hotel,
      images: hotel.images?.length ? hotel.images : [""],
      amenities: hotel.amenities || []
    });

    setShowModal(true);
  };

  /* ================= AMENITIES ================= */

  const addAmenity = () => {
    const trimmed = newAmenity.trim();

    if (!trimmed) return;

    if (formData.amenities.includes(trimmed)) {
      toast.error("Already added");
      return;
    }

    setFormData({
      ...formData,
      amenities: [...formData.amenities, trimmed]
    });

    setNewAmenity("");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hotels</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-5 py-2 rounded-xl"
        >
          <FaPlus /> Add Hotel
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : hotels.length === 0 ? (
        <p className="text-center text-gray-500">No hotels found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.isArray(hotels) && hotels.map((h) => (
            <div key={h._id} className="bg-white p-5 rounded-xl shadow">

              <img
                src={
                  h.images?.[0]?.trim()
                    ? h.images[0]
                    : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                }
                className="h-40 w-full object-cover rounded-lg mb-3"
                alt={h.name}
              />

              <h2 className="font-bold">{h.name}</h2>

              <p className="text-sm text-gray-500">
                {h.city}, {h.country}
              </p>

              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < h.stars ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(h)}
                  className="flex-1 bg-black text-white py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(h._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur">

          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingHotel ? "Edit Hotel" : "Add Hotel"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={editingHotel ? handleUpdate : handleCreate}
              className="p-6 grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto"
            >

              <Input label="Name" value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })} />

              <Textarea label="Description" value={formData.description}
                onChange={(v) => setFormData({ ...formData, description: v })} />

              <Input label="Price" type="number" value={formData.pricePerNight}
                onChange={(v) => setFormData({ ...formData, pricePerNight: v })} />

              <Select value={formData.stars}
                onChange={(v) => setFormData({ ...formData, stars: v })} />

              <Input label="City" value={formData.city}
                onChange={(v) => setFormData({ ...formData, city: v })} />

              <Input label="Country" value={formData.country}
                onChange={(v) => setFormData({ ...formData, country: v })} />

              {/* Amenities */}
              <div>
                <input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Amenity"
                  className="border px-3 py-2 rounded w-full"
                />
                <button type="button" onClick={addAmenity} className="mt-2 text-blue-600">
                  Add
                </button>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData.amenities.map((a, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              {formData.images.map((img, i) => (
                <input
                  key={i}
                  value={img}
                  onChange={(e) => {
                    const arr = [...formData.images];
                    arr[i] = e.target.value;
                    setFormData({ ...formData, images: arr });
                  }}
                  className="border px-3 py-2 rounded w-full"
                />
              ))}

              {/* FOOTER */}
              <div className="col-span-2 flex justify-end gap-4">
                <button type="button" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancel
                </button>

                <button className="bg-orange-500 text-white px-6 py-2 rounded">
                  {editingHotel ? "Update" : "Create"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE INPUTS ================= */

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

const Select = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border px-3 py-2 rounded"
  >
    {[1, 2, 3, 4, 5].map((s) => (
      <option key={s} value={s}>{s} Star</option>
    ))}
  </select>
);