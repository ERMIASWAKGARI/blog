import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import logo from "../../public/DLogo.png";
import femaleDefault from "../../public/jane_smith.png";
import maleDefault from "../../public/john_doe.png";

interface NavLinkProps {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavbarLoggedIn: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsSticky(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    navigate("/");
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const photoSrc = user?.photo
    ? `${user.photo}`
    : user?.gender === "female"
    ? femaleDefault
    : maleDefault;

  return (
    <nav
      className={`bg-blue-50 z-50 transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 right-0 shadow-md py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/home" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Company Logo"
              className="h-8 md:h-10 p-1 rounded-full"
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <span
              className="text-xl md:text-2xl font-bold ml-2 text-black"
              style={{ fontFamily: "MuseoModerno, sans-serif" }}
            >
              Debbal Tech Gazette
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <DesktopNavLink to="/home">Home</DesktopNavLink>
            <DesktopNavLink to="/profile/userProfile">Profile</DesktopNavLink>

            {/* User Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-2 py-1 rounded-full transition-colors duration-200 hover:bg-blue-100 focus:outline-none"
              >
                <img
                  src={photoSrc}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-base font-medium text-gray-800">
                  {user?.name || "User"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeDropdown();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="mr-2 text-purple-600" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Mobile User Avatar (visible only on mobile) */}
            <button
              onClick={toggleDropdown}
              className="md:hidden flex items-center"
            >
              <img
                src={photoSrc}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed right-0 top-16 bg-white shadow-lg rounded-bl-lg transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100 z-50"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-3 w-64">
          <MobileNavLink to="/home" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink
            to="/profile/userProfile"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </MobileNavLink>
        </div>
      </div>

      {/* Mobile Dropdown (for user avatar) */}
      {isDropdownOpen && (
        <div className="md:hidden fixed right-4 top-20 bg-white rounded-md shadow-lg z-50 border border-gray-200 w-48">
          <button
            onClick={() => {
              handleLogout();
              closeDropdown();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-2 text-purple-600" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

// Desktop NavLink Component (with stable hover effect)
const DesktopNavLink: React.FC<NavLinkProps> = ({ to, onClick, children }) => (
  <div className="relative px-2">
    <Link
      to={to}
      className={`block px-4 py-2 text-sm font-medium text-gray-800 rounded-full transition-all duration-200 hover:text-purple-600`}
      onClick={onClick}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
    </Link>
  </div>
);

// Mobile NavLink Component
const MobileNavLink: React.FC<NavLinkProps> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
  >
    {children}
  </Link>
);

export default NavbarLoggedIn;
