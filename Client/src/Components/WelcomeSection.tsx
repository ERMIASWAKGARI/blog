import React from "react";
import { Link } from "react-router-dom";
import { FaArrowDown, FaPlus } from "react-icons/fa";
import heroImage from "../../public/vecteezy_touching-technology-and-icon-customer-global-network-connection_3503591.jpg";

const WelcomeSection: React.FC = () => {
  const scrollToPosts = () => {
    const postListSection = document.getElementById("latest-posts");
    postListSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Debbal Tech
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
                Gazette
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover cutting-edge technology insights, share your expertise,
              and join our community of innovators
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              to="/profile/addPost"
              className="group relative flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <FaPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Create Post</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>

            <button
              onClick={scrollToPosts}
              className="group flex items-center justify-center space-x-3 bg-transparent border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <span>Explore Content</span>
              <FaArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div
          onClick={scrollToPosts}
          className="flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors duration-300 cursor-pointer group"
        >
          <span className="text-sm font-medium group-hover:translate-y-1 transition-transform">
            Discover More
          </span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:mt-3 transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
