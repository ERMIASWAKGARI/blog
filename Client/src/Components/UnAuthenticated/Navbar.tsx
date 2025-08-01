import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../public/DLogo.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navbarHeight = 64;

  const handleNavigation = (id: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const section = document.getElementById(id);
      if (section) {
        const offsetTop = section.offsetTop - navbarHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
        setIsOpen(false);
      }
    }
  };

  const textColor = "text-gray-800";
  const hoverTextColor = "text-purple-600";
  const bgColor = "bg-white";
  const shadow = "shadow-md";

  return (
    <nav
      className={`${bgColor} ${shadow} fixed w-full top-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("hero")}
          >
            <img
              src={logo}
              alt="Debbal Technologies Logo"
              className="h-10 md:h-12 p-1 rounded-full"
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <span
              className="ml-2 text-xl font-bold text-gray-900"
              style={{ fontFamily: "MuseoModerno, sans-serif" }}
            >
              Debbal Tech Gazette
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              onClick={() => handleNavigation("hero")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("about")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              About
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("latest-posts")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Blogs
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("categories")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Categories
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("testimonials")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Testimonials
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("authors")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Authors
            </NavLink>
            <NavLink
              onClick={() => handleNavigation("newsletter")}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            >
              Newsletter
            </NavLink>
          </div>

          {/* Login Button - Desktop */}
          <div className="hidden md:block ml-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className={`text-xl ${textColor} focus:outline-none`}
              aria-label="Toggle navigation"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed right-0 top-16 w-auto min-w-[200px] bg-white shadow-lg rounded-bl-lg transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-1 p-2">
          <MobileNavLink
            onClick={() => handleNavigation("hero")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Home
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("about")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            About
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("latest-posts")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Blogs
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("categories")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Categories
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("testimonials")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Testimonials
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("authors")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Authors
          </MobileNavLink>
          <MobileNavLink
            onClick={() => handleNavigation("newsletter")}
            textColor={textColor}
            hoverTextColor={hoverTextColor}
          >
            Newsletter
          </MobileNavLink>
          <Link
            to="/login"
            className="mt-1 text-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-300 text-sm"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink Component
const NavLink: React.FC<{
  onClick: () => void;
  textColor: string;
  hoverTextColor: string;
  children: React.ReactNode;
}> = ({ children, onClick, textColor, hoverTextColor }) => (
  <div className="px-1">
    <a
      className={`px-3 py-2 text-sm font-medium ${textColor} hover:${hoverTextColor} transition-all duration-200 ease-in-out cursor-pointer relative group`}
      onClick={onClick}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
    </a>
  </div>
);

// Mobile NavLink Component
const MobileNavLink: React.FC<{
  onClick: () => void;
  textColor: string;
  hoverTextColor: string;
  children: React.ReactNode;
}> = ({ children, onClick, textColor, hoverTextColor }) => (
  <a
    className={`px-4 py-2 text-sm font-medium ${textColor} hover:${hoverTextColor} hover:bg-gray-50 rounded-md transition-all duration-200 cursor-pointer`}
    onClick={onClick}
  >
    {children}
  </a>
);

export default Navbar;
