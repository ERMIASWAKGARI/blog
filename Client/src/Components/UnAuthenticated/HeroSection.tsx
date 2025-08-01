import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import logo from "../../../public/DLogo.png";

interface Props {
  id: string;
}

const HeroSection: React.FC<Props> = ({ id }) => {
  const navbarHeight = 64;

  const handleNavigation = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offsetTop = section.offsetTop - navbarHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Background animation effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mouse-x", x.toString());
      document.documentElement.style.setProperty("--mouse-y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header
      id={id}
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-95">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_var(--mouse-x,_0.5)_var(--mouse-y,_0.5),_rgba(255,255,255,0.4)_0%,_transparent_70%)] transition-all duration-1000"></div>
      </div>

      {/* Content container */}
      <div className="relative z-20 px-6 py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src={logo}
            alt="Debbal Technologies"
            className="w-24 mx-auto mb-6 filter drop-shadow-lg"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Discover Tech Insights <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
            That Matter
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Cutting-edge tutorials, industry analysis, and technology trends from
          our expert team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => handleNavigation("latest-posts")}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
          >
            <span className="relative z-10 flex items-center justify-center">
              Explore Latest Posts
              <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>

          <button
            onClick={() => handleNavigation("newsletter")}
            className="group relative px-8 py-4 bg-transparent border-2 border-purple-500 rounded-full text-white font-medium overflow-hidden transition-all duration-300 hover:bg-purple-500/10"
          >
            <span className="relative z-10 flex items-center justify-center">
              Join Newsletter
              <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-gray-400 rounded-full mt-2"
          ></motion.div>
        </div>
      </motion.div>
    </header>
  );
};

export default HeroSection;
