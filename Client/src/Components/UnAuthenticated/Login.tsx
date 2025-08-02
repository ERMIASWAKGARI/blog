/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { motion } from "framer-motion";
import ErrorMessage from "../Profile/UserProfile/ErrorMessage";
import SuccessMessage from "../Profile/UserProfile/SuccessMessage";
import LoadingSpinner from "./LoadingSpinner";
import api from "../../axiosConfig";

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  async function formSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const userCredential = await api.post(`/users/login`, {
        email,
        password,
      });

      if (userCredential) {
        setError("");
        setShowErrorMessage(false);
        setResult("Congratulations! Successfully logged in.");
        localStorage.setItem("authToken", userCredential.data.token);
        const userData = userCredential.data.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setShowSuccessMessage(true);
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error: any) {
      setShowSuccessMessage(false);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-xl z-10">
            <LoadingSpinner loading={loading} />
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <motion.h2
            className="text-3xl font-bold text-center mb-8 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Welcome Back
          </motion.h2>

          {showSuccessMessage && (
            <SuccessMessage
              message="Logged in successfully!"
              onClose={() => setShowSuccessMessage(false)}
            />
          )}
          {showErrorMessage && (
            <ErrorMessage
              message={error}
              onClose={() => setShowErrorMessage(false)}
            />
          )}

          {!showSuccessMessage && (
            <form onSubmit={formSubmitHandler} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400" size={20} />
                </div>
                <input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400" size={20} />
                </div>
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end"
              >
                <Link
                  to="/forgotpassword"
                  className="text-sm text-indigo-600 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  Login
                </button>
              </motion.div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
