import { useEffect, useState } from "react";
import { getAllHotels, deleteHotel, createHotel, updateHotel } from "../../services/hotelService";
import { FaHotel, FaEdit, FaTrash, FaPlus, FaStar, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

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

  const fetchHotels = async () => {
    try {
      const data = await getAllHotels();
      setHotels(data);
      toast.success("Hotels loaded successfully");
    } catch (err) {
      toast.error("Failed to load hotels");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    
    try {
      await deleteHotel(id);
      toast.success("Hotel deleted successfully");
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        stars: Number(formData.stars),
        images: formData.images.filter(img => img.trim() !== ""),
        amenities: formData.amenities
      };

      await createHotel(hotelData);
      toast.success("Hotel created successfully");
      setShowModal(false);
      resetForm();
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        stars: Number(formData.stars),
        images: formData.images.filter(img => img.trim() !== ""),
        amenities: formData.amenities
      };

      await updateHotel(editingHotel._id, hotelData);
      toast.success("Hotel updated successfully");
      setShowModal(false);
      setEditingHotel(null);
      resetForm();
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || "",
      description: hotel.description || "",
      address: hotel.address || "",
      city: hotel.city || "",
      country: hotel.country || "",
      stars: hotel.stars || 3,
      pricePerNight: hotel.pricePerNight || "",
      amenities: hotel.amenities || [],
      images: hotel.images?.length > 0 ? hotel.images : [""]
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
      images: [""]
    });
    setEditingHotel(null);
    setNewAmenity("");
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

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const renderStars = (stars) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < stars ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-3">
            <FaHotel className="text-blue-600" />
            <span>Manage Hotels</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage all hotel properties in your system</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Hotel</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">{hotels.length}</div>
          <div className="text-sm text-gray-500">Total Hotels</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-green-600">
            {hotels.filter(h => h.stars >= 4).length}
          </div>
          <div className="text-sm text-gray-500">4+ Star Hotels</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(hotels.map(h => h.city)).size}
          </div>
          <div className="text-sm text-gray-500">Cities</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {hotels.reduce((acc, hotel) => acc + (hotel.rooms?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-500">Total Rooms</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading hotels...</p>
          </div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border">
          <div className="text-center">
            <FaHotel className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hotels found</p>
            <p className="text-gray-400 text-sm mt-2">Get started by adding your first hotel</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={hotel.images?.[0] || "/placeholder.jpg"}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                  {renderStars(hotel.stars)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{hotel.name}</h2>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {hotel.rooms?.length || 0} rooms
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <FaMapMarkerAlt className="text-gray-400 mr-1" />
                  <span className="truncate">{hotel.city}, {hotel.country}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {hotel.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-green-600">
                    ₹{hotel.pricePerNight}/night
                  </div>
                  <div className="text-sm text-gray-500">
                    {hotel.amenities?.slice(0, 2).join(", ")}
                    {hotel.amenities?.length > 2 && "..."}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(hotel)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaEdit className="text-sm" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaTrash className="text-sm" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Hotel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center space-x-2">
                  <FaHotel className="text-blue-600" />
                  <span>{editingHotel ? "Edit Hotel" : "Add New Hotel"}</span>
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingHotel ? handleUpdate : handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Grand Plaza Hotel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Hotel description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                      <select
                        value={formData.stars}
                        onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5].map(star => (
                          <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="2999"
                      />
                    </div>
                  </div>

                  {/* Location & Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location & Media</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          placeholder="USA"
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          placeholder="Add amenity..."
                        />
                        <button
                          type="button"
                          onClick={addAmenity}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                          >
                            <span>{amenity}</span>
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <button
                          type="button"
                          onClick={addImageField}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
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
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="https://example.com/hotel-image.jpg"
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>{editingHotel ? "Update Hotel" : "Create Hotel"}</span>
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