import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

const CONTACT_INFO = [
  {
    icon: FaPhone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    sub: "Mon–Sun, 9am–9pm",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20"
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "support@raynotthotels.com",
    sub: "We reply within 2 hours",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20"
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "123 Luxury Street",
    sub: "Hotel District, City 10001",
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20"
  },
  {
    icon: FaClock,
    label: "Support hours",
    value: "24 / 7",
    sub: "Always here for you",
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20"
  }
];

const SUBJECTS = [
  "Booking enquiry",
  "Cancellation / refund",
  "Room upgrade",
  "Special request",
  "Complaint",
  "Other"
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused]   = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const inputClass = (key) =>
    `w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none border transition-all duration-200 bg-white ${
      focused === key
        ? "border-orange-400 ring-2 ring-orange-100"
        : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* PAGE HEADER */}
      <div className="bg-gray-950 text-white pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
            Support
          </span>
          <h1 className="text-5xl font-black mb-3 tracking-tight">Contact Us</h1>
          <p className="text-gray-400 text-base max-w-xl">
            Have a question about a booking or need a hand? Our team is always ready to help.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* LEFT — contact info */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Get in touch</h2>

            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, color, bg }) => (
              <motion.div
                key={label}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${bg}`}>
                  <Icon className={`text-sm ${color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide uppercase text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-100 mt-2">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=60"
                alt="Map"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gray-950/30 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaMapMarkerAlt className="text-orange-500 text-xs" />
                  123 Luxury Street, Hotel District
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10">

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                    <FaCheckCircle className="text-emerald-500 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Thanks for reaching out. We'll get back to you within 2 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Send another message
                    <FaArrowRight className="text-xs" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Send a message</h2>
                    <p className="text-gray-400 text-sm">We'll get back to you within 2 hours</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                          Full name *
                        </label>
                        <input
                          type="text" name="name" required
                          placeholder="Jane Smith"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          className={inputClass("name")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                          Email address *
                        </label>
                        <input
                          type="email" name="email" required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          className={inputClass("email")}
                        />
                      </div>
                    </div>

                    {/* Subject as select */}
                    <div>
                      <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                        Subject *
                      </label>
                      <select
                        name="subject" required
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused("subject")}
                        onBlur={() => setFocused(null)}
                        className={inputClass("subject") + " cursor-pointer"}
                      >
                        <option value="" disabled>Select a topic…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-1.5">
                        Message *
                      </label>
                      <textarea
                        name="message" required rows={5}
                        placeholder="Tell us how we can help…"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className={inputClass("message") + " resize-none"}
                      />
                      <p className="text-right text-xs text-gray-300 mt-1">
                        {formData.message.length} / 1000
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:scale-100 disabled:shadow-none transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-xs" />
                          Send message
                        </>
                      )}
                    </button>

                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}