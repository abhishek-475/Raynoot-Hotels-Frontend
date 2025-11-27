import { Link } from "react-router-dom";
import { 
  FaBed, 
  FaUser, 
  FaWifi, 
  FaTv, 
  FaSnowflake, 
  FaCoffee, 
  FaShower,
  FaUtensils,
  FaCar,
  FaLock,
  FaStar,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";

export default function RoomCard({ room, hotelId }) {
  const amenities = [
    { icon: FaWifi, label: "Free WiFi", available: room.amenities?.includes('wifi') },
    { icon: FaTv, label: "TV", available: room.amenities?.includes('tv') },
    { icon: FaSnowflake, label: "AC", available: room.amenities?.includes('ac') },
    { icon: FaCoffee, label: "Coffee", available: room.amenities?.includes('coffee') },
    { icon: FaShower, label: "Shower", available: room.amenities?.includes('shower') },
    { icon: FaUtensils, label: "Mini Bar", available: room.amenities?.includes('minibar') },
    { icon: FaCar, label: "Parking", available: room.amenities?.includes('parking') },
    { icon: FaLock, label: "Safe", available: room.amenities?.includes('safe') }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (originalPrice > currentPrice) {
      const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
      return Math.round(discount);
    }
    return null;
  };

  const originalPrice = room.originalPrice || room.price * 1.2; // 20% higher for demo
  const discount = calculateDiscount(originalPrice, room.price);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={room.images?.[0] || "/room-placeholder.jpg"}
          alt={room.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
            {discount}% OFF
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <FaStar className="text-yellow-400" size={10} />
          <span>4.8</span>
        </div>

        {/* Quick View Overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center space-x-2">
            <FaCalendarAlt size={14} />
            <span>Quick View</span>
          </button>
        </div> */}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Room Title and Type */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {room.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {room.description || "Luxurious room with modern amenities and comfortable bedding for a perfect stay."}
          </p>
        </div>

        {/* Capacity and Size */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FaBed className="text-blue-500" size={14} />
              <span>{room.bedType || "King Bed"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUser className="text-green-500" size={14} />
              <span>Up to {room.capacity || 2} guests</span>
            </div>
          </div>
          {room.size && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {room.size} sq.ft
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors duration-300 ${
                    amenity.available 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-400"
                  }`}
                  title={amenity.label}
                >
                  <IconComponent size={12} />
                  <span className="hidden sm:inline">{amenity.label}</span>
                </div>
              );
            })}
            {amenities.filter(a => a.available).length > 4 && (
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                +{amenities.filter(a => a.available).length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(room.price)}
            </span>
            <span className="text-sm text-gray-500">/ night</span>
            {discount && (
              <span className="text-sm text-red-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount && (
            <p className="text-xs text-green-600 font-semibold">
              You save {formatPrice(originalPrice - room.price)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/booking/${hotelId}/${room._id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2 group/btn"
          >
            <span>Book Now</span>
            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-200" size={14} />
          </Link>
          
        
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Available</span>
          </div>
          <div className="text-xs text-gray-500">
            Free cancellation
          </div>
        </div>

        {/* Special Features */}
        {(room.features && room.features.length > 0) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {room.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Best Value Badge */}
      {room.bestValue && (
        <div className="absolute top-44 right-4 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold rotate-12 shadow-lg">
          Best Value
        </div>
      )}
    </div>
  );
}