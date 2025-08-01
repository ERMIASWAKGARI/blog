import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import SignUp from "./Signup";
import Navbar from "./Navbar";
import { FiArrowRight, FiUser, FiKey, FiClock } from "react-icons/fi";

const AuthenticationPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLogin(true);
    } else if (location.pathname === "/signup") {
      setShowLogin(false);
    }
  }, [location]);

  const handleLoginClick = () => {
    if (!showLogin) {
      navigate("/login");
    }
  };

  const handleSignUpClick = () => {
    if (showLogin) {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Static Left Panel - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <motion.h1
                  className="text-4xl font-bold text-white mb-6"
                  style={{ fontFamily: "MuseoModerno, sans-serif" }}
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Debbal Tech Gazette
                </motion.h1>

                <motion.p
                  className="text-xl text-indigo-100 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Join our community of tech enthusiasts and share your
                  knowledge.
                </motion.p>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center text-indigo-100">
                      <FiUser className="mr-3 text-xl" />
                      <span>Personalized dashboard</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center text-indigo-100">
                      <FiKey className="mr-3 text-xl" />
                      <span>Secure authentication</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center text-indigo-100">
                      <FiClock className="mr-3 text-xl" />
                      <span>Timely posts/insights</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form (Animated) */}
            <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="flex justify-center space-x-4 mb-10">
                <motion.button
                  onClick={handleLoginClick}
                  className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    showLogin
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: showLogin ? 1 : 1.05 }}
                >
                  {showLogin && (
                    <motion.span
                      layoutId="authTab"
                      className="absolute inset-0 bg-white bg-opacity-10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2 }}
                    />
                  )}
                  Login
                </motion.button>

                <motion.button
                  onClick={handleSignUpClick}
                  className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    !showLogin
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: !showLogin ? 1 : 1.05 }}
                >
                  {!showLogin && (
                    <motion.span
                      layoutId="authTab"
                      className="absolute inset-0 bg-white bg-opacity-10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2 }}
                    />
                  )}
                  Sign Up
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={showLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {showLogin ? <Login /> : <SignUp />}
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="mt-8 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {showLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={showLogin ? handleSignUpClick : handleLoginClick}
                  className="text-indigo-600 font-medium hover:underline focus:outline-none"
                >
                  {showLogin ? "Sign up" : "Login"}
                  <FiArrowRight className="inline ml-1" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
