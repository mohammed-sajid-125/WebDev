import { useState, useEffect, useRef } from "react";
import LocationModal from "./locationBox";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../Pages/Login/registerForm";
import dp from '../assets/dp.jpg';
import FloatingBar from "./FloatingBar";
import { useAuth } from '../contexts/AuthContext';
import { useFloatingBarStore } from '../store/floatingBarStore';

const navigation = [
  { name: "Health", href: "/", current: false },
  { name: "Medical Services", href: "/services", current: false },
  { name: "About Us", href: "/aboutUs", current: false },
  { name: "FAQs", href: "/faqs", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const stickyMode = false; // Set to true to enable sticky+enhanced behaviors

const Navbar = ({ location, setLocation }) => {
  const {user} = useAuth();
  const [selected, setSelected] = useState("Health");
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toggle, isVisible } = useFloatingBarStore();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  // Enhancement states
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!stickyMode) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <div
        className={
          stickyMode
            ? `top-0 z-50 w-full transition-all duration-300 bg-white h-16 ${
                scrolled ? "shadow-lg" : ""
              } ${hidden ? "-translate-y-full" : "translate-y-0"} sticky`
            : "w-full bg-white h-16"
        }
        style={{ position: stickyMode ? undefined : "static" }}
      >
        <div className="flex items-center justify-between px-6 sm:px-12 h-full">
          {/* Logo */}
          <button
            className="text-4xl font-bold text-black bg-transparent border-0 p-0"
            onClick={() => navigate("/")}
          >
            HAMS
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center flex-1 space-x-6">
            {navigation.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  setSelected(item.name);
                  navigate(item.href);
                }}
                className={classNames(
                  selected === item.name
                    ? "border-b-2 border-[#527C88] text-[#527C88]"
                    : "hover:border-b-2 hover:text-[#527C88] border-[#527C88]",
                  "px-3 py-2 text-sm font-medium transition cursor-pointer"
                )}
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
          >
            <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Location & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Location */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1 text-sm text-black hover:text-blue-600 font-medium"
            >
              <LocationOnOutlinedIcon className="text-xl" />
              <span>{location}</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Auth / Avatar */}
            {isLoggedIn ? (
              <div className="flex gap-2 items-center cursor-pointer" onClick={toggle}>
                <div className="rounded-full h-10 w-10 bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={user.photo?.url || dp}
                    alt="User profile"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500 tracking-wide">
                    {user?.role?.toUpperCase() || "USER"}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-full bg-[#10217D] hover:bg-[#1a2bb8] transition cursor-pointer"
                onClick={() => setShowRegister(true)}
              >
                <button className="text-white px-4 py-2 text-sm font-medium">
                  SignUp / Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-opacity-60 flex md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-white w-64 h-full shadow-lg flex flex-col p-6 gap-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelected(item.name);
                    setMobileMenuOpen(false);
                    navigate(item.href);
                  }}
                  className={classNames(
                    selected === item.name
                      ? "border-l-4 border-[#527C88] text-[#527C88] bg-cyan-50"
                      : "hover:border-l-4 hover:text-[#527C88] border-[#527C88]",
                    "px-4 py-2 text-base font-medium transition cursor-pointer rounded"
                  )}
                >
                  {item.name}
                </div>
              ))}
            </nav>
            {/* Location & Auth for Mobile */}
            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => {
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-black hover:text-blue-600 font-medium"
              >
                <LocationOnOutlinedIcon className="text-xl" />
                <span>{location}</span>
              </button>
              {isLoggedIn ? (
                <div className="flex gap-2 items-center cursor-pointer" onClick={() => { toggle(); setMobileMenuOpen(false); }}>
                  <div className="rounded-full h-10 w-10 bg-gray-800 overflow-hidden flex items-center justify-center">
                    <img
                      src={user.photo?.url || dp}
                      alt="User profile"
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500 tracking-wide">
                      {user?.role?.toUpperCase() || "USER"}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-full bg-[#10217D] hover:bg-[#1a2bb8] transition cursor-pointer"
                  onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }}
                >
                  <button className="text-white px-4 py-2 text-sm font-medium">
                    SignUp / Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FloatingBar Overlay (Profile Sidebar) */}
      {isVisible && (
        <div className="fixed inset-0" onClick={toggle}>
          <FloatingBar />
        </div>
      )}

      {/* Location Selector Modal */}
      <LocationModal
        open={open}
        onClose={() => setOpen(false)}
        setLocation={setLocation}
      />

      {/* Register/Login Modal */}
      {showRegister && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-max max-h-[90vh] flex flex-col shadow-lg overflow-hidden relative overflow-y-auto">
            {/* Registration Form */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
              <RegisterForm onClose={() => setShowRegister(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
