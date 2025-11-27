import { Link } from "react-router-dom";
import { 
  FaHotel, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset
} from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const supportLinks = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" }
  ];

  const amenities = [
    { icon: FaWifi, name: "Free WiFi" },
    { icon: FaSwimmingPool, name: "Swimming Pool" },
    { icon: FaUtensils, name: "Restaurant" },
    { icon: FaCar, name: "Parking" },
    { icon: FaShieldAlt, name: "Security" },
    { icon: FaCreditCard, name: "Easy Payment" }
  ];

  const socialLinks = [
    { icon: FaFacebook, name: "Facebook", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaLinkedin, name: "LinkedIn", url: "#" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                <FaHotel className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Raynott Hotels
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Experience luxury and comfort at its finest. Book your perfect stay anywhere in the world with unparalleled service and amenities.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="bg-gray-700 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    aria-label={social.name}
                  >
                    <IconComponent className="text-white text-lg" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Support</span>
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-green-500 transition-colors"></div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Contact Info</span>
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm">123 Luxury Avenue</p>
                  <p className="text-sm">Premium District, City 10001</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <FaPhone className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm">+1 (555) 123-4567</p>
                  <p className="text-sm">24/7 Support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <FaEnvelope className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm">info@raynotthotels.com</p>
                  <p className="text-sm">reservations@raynotthotels.com</p>
                </div>
              </div>
            </div>

            {/* Featured Amenities */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Featured Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {amenities.slice(0, 4).map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2 text-gray-400 text-xs">
                      <IconComponent className="text-blue-400" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-xl">
                <FaHeadset className="text-white text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Stay Updated</h4>
                <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive offers</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 flex-1 min-w-0"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-2 justify-center">
                <FaEnvelope className="text-sm" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} Raynott Hotels. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <FaShieldAlt className="text-green-400" />
              <span>Secure Booking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}