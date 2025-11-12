import React, { useEffect, useState, useRef } from "react";
import { FaSignOutAlt, FaUser, FaHome } from "react-icons/fa";
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.pageYOffset > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <>
      {/* Backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-50 transition-all duration-500 ${
          isSticky
            ? "fixed top-0 left-0 right-0 shadow-lg py-0"
            : "py-4 relative"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to="/home" className="flex items-center flex-shrink-0 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Debbal Tech Gazette"
                  className="h-10 w-10 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
              </div>
              <span className="text-xl font-bold ml-3 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                Debbal Tech Gazette
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <DesktopNavLink to="/home" icon={<FaHome className="w-4 h-4" />}>
                Home
              </DesktopNavLink>
              <DesktopNavLink
                to="/profile/userProfile"
                icon={<FaUser className="w-4 h-4" />}
              >
                Profile
              </DesktopNavLink>

              {/* User Dropdown */}
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100/80 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={photoSrc}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full ring-2 ring-purple-200"
                    />
                    <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                      {user?.name || "User"}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-200/60">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
                    >
                      <FaSignOutAlt className="mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2"
              >
                <img
                  src={photoSrc}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full ring-2 ring-purple-200"
                />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 transition-all duration-300 transform ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-4 opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col p-2 w-64">
            <MobileNavLink
              to="/home"
              icon={<FaHome className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/profile/userProfile"
              icon={<FaUser className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </MobileNavLink>
            <div className="border-t border-gray-200/60 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      {isSticky && <div className="h-16"></div>}
    </>
  );
};

// Enhanced Desktop NavLink Component
const DesktopNavLink: React.FC<NavLinkProps & { icon?: React.ReactNode }> = ({
  to,
  onClick,
  children,
  icon,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg transition-all duration-300 hover:text-purple-600 hover:bg-purple-50/80 group relative"
  >
    {icon}
    <span>{children}</span>
    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
  </Link>
);

// Enhanced Mobile NavLink Component
const MobileNavLink: React.FC<NavLinkProps & { icon?: React.ReactNode }> = ({
  to,
  onClick,
  children,
  icon,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors duration-200"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default NavbarLoggedIn;
