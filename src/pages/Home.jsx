import { Link } from "react-router-dom";
import { 
  FaHotel, 
  FaMapMarkerAlt, 
  FaStar, 
  FaWifi, 
  FaSwimmingPool, 
  FaUtensils,
  FaCar,
  FaSpa,
  FaDumbbell,
  FaConciergeBell,
  FaShieldAlt,
  FaSearch,
  FaArrowRight
} from "react-icons/fa";

export default function Home() {
  const popularDestinations = [
    { 
      name: "Paris", 
      country: "France", 
      hotels: 124,
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    { 
      name: "New York", 
      country: "USA", 
      hotels: 98,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    { 
      name: "Tokyo", 
      country: "Japan", 
      hotels: 87,
      image: "https://images.unsplash.com/photo-1540959733332-0b10d1e4b288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    { 
      name: "London", 
      country: "UK", 
      hotels: 112,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    { 
      name: "Dubai", 
      country: "UAE", 
      hotels: 76,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    { 
      name: "Sydney", 
      country: "Australia", 
      hotels: 65,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const features = [
    { icon: FaWifi, title: "Free WiFi", description: "Stay connected with high-speed internet" },
    { icon: FaSwimmingPool, title: "Swimming Pool", description: "Relax in our luxurious pools" },
    { icon: FaUtensils, title: "Fine Dining", description: "Exquisite culinary experiences" },
    { icon: FaCar, title: "Free Parking", description: "Complimentary parking facilities" },
    { icon: FaSpa, title: "Spa & Wellness", description: "Rejuvenate your mind and body" },
    { icon: FaDumbbell, title: "Fitness Center", description: "State-of-the-art gym equipment" },
    { icon: FaConciergeBell, title: "24/7 Service", description: "Round-the-clock concierge" },
    { icon: FaShieldAlt, title: "Safe & Secure", description: "Your safety is our priority" }
  ];

  const testimonials = [
    { name: "Sarah Johnson", location: "New York", rating: 5, comment: "Exceptional service and beautiful rooms. Will definitely return!", avatar: "S" },
    { name: "Mike Chen", location: "Tokyo", rating: 5, comment: "The attention to detail was remarkable. Perfect business stay.", avatar: "M" },
    { name: "Emma Davis", location: "London", rating: 4, comment: "Loved the spa facilities and the amazing city views!", avatar: "E" }
  ];

  // Fallback image in case of loading errors
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <FaHotel className="text-4xl md:text-5xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Raynott
              </span>{" "}
              Hotels
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover luxury accommodations and unforgettable experiences at the world's finest destinations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/hotels"
                className="group bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <FaSearch className="text-lg" />
                <span>Explore Hotels</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-t border-b border-white border-opacity-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                <div className="text-blue-100 text-sm">Luxury Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
                <div className="text-blue-100 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">1M+</div>
                <div className="text-blue-100 text-sm">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-100 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our most sought-after locations around the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={destination.name}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative w-full h-full">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="text-red-400" />
                    <span className="font-semibold text-lg">{destination.name}</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-2">{destination.country}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-blue-500 bg-opacity-70 px-3 py-1 rounded-full backdrop-blur-sm">
                      {destination.hotels} hotels
                    </span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay with explore button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black bg-opacity-50 rounded-xl p-4 backdrop-blur-sm">
                    <Link
                      to="/hotels"
                      className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 inline-flex items-center space-x-2"
                    >
                      <span>Explore</span>
                      <FaArrowRight className="text-sm" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Destinations Button */}
          <div className="text-center mt-12">
            <Link
              to="/hotels"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Destinations</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Raynott Hotels?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience unparalleled luxury and service with our premium amenities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="text-blue-600 text-2xl group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Dream Vacation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of satisfied guests who have experienced the Raynott difference
          </p>
          <Link
            to="/hotels"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Book Your Stay Now
          </Link>
        </div>
      </section>
    </div>
  );
}