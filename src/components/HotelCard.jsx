import { Link } from "react-router-dom";
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaWifi, 
  FaSwimmingPool, 
  FaCar, 
  FaUtensils,
  FaSpa,
  FaDumbbell,
  FaEye,
  FaHeart,
  FaShare
} from "react-icons/fa";

export default function HotelCard({ hotel }) {
  const amenities = [
    { icon: FaWifi, available: hotel.amenities?.includes('wifi') },
    { icon: FaSwimmingPool, available: hotel.amenities?.includes('pool') },
    { icon: FaCar, available: hotel.amenities?.includes('parking') },
    { icon: FaUtensils, available: hotel.amenities?.includes('restaurant') },
    { icon: FaSpa, available: hotel.amenities?.includes('spa') },
    { icon: FaDumbbell, available: hotel.amenities?.includes('gym') }
  ];

  const renderStars = (stars) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < stars ? "text-yellow-400" : "text-gray-300"}
        size={14}
      />
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={hotel.images?.[0] || "/hotel-placeholder.jpg"}
          alt={hotel.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay with Actions */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg">
              <FaHeart className="text-red-400 text-sm" />
            </button>
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg">
              <FaShare className="text-blue-500 text-sm" />
            </button>
          </div>
        </div> */}

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <div className="flex items-center space-x-1">
            {renderStars(hotel.stars || 4)}
            <span className="text-xs font-semibold text-gray-700 ml-1">
              {hotel.stars || 4}.0
            </span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-sm font-bold">
            {formatPrice(hotel.pricePerNight || 2999)}
          </div>
          <div className="text-xs opacity-90">per night</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Hotel Name and Location */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {hotel.name}
          </h2>
          <div className="flex items-center space-x-2 mt-2 text-gray-600">
            <FaMapMarkerAlt className="text-red-400" size={14} />
            <span className="text-sm">
              {hotel.city}, {hotel.country}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {hotel.description || "Experience luxury and comfort in the heart of the city with premium amenities and exceptional service."}
        </p>

        {/* Amenities */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    amenity.available 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-400"
                  }`}
                  title={amenity.available ? "Available" : "Not available"}
                >
                  <IconComponent size={16} />
                </div>
              );
            })}
          </div>
          {amenities.filter(a => a.available).length > 4 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              +{amenities.filter(a => a.available).length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/hotels/${hotel._id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2 group/btn"
          >
            <FaEye className="text-sm" />
            <span>View Details</span>
          </Link>
          
          
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {hotel.rooms?.length || 12} rooms available
          </div>
          <div className="text-xs text-green-600 font-semibold flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Special Offer Badge */}
      {(hotel.discount || Math.random() > 0.7) && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          {hotel.discount || "20% OFF"}
        </div>
      )}
    </div>
  );
}