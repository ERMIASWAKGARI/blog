/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ErrorMessage from "../Profile/UserProfile/ErrorMessage";
import SuccessMessage from "../Profile/UserProfile/SuccessMessage";
import LoadingSpinner from "./LoadingSpinner";
import api from "../../axiosConfig";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateName = (name: string) => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(name);
  };

  const validateForm = () => {
    if (!name || !email || !password || !passwordConfirm) {
      setError("All fields are required.");
      return false;
    }
    if (!validateName(name)) {
      setError("Name can only contain letters and spaces.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  async function SignUpSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSignupSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("passwordConfirm", passwordConfirm);
      formData.append("gender", gender);
      if (photo) formData.append("photo", photo);

      const response = await api.post(`/users/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setSignupSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error: any) {
      setSignupSuccess(false);
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
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
            Create Account
          </motion.h2>

          {error && !signUpSuccess && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}
          {signUpSuccess && !error && (
            <SuccessMessage
              message="Sign up successful!"
              onClose={() => setSignupSuccess(false)}
            />
          )}

          <form onSubmit={SignUpSubmitHandler} className="space-y-4">
            {[
              {
                icon: <MdPerson className="text-gray-400" size={20} />,
                type: "text",
                value: name,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value),
                placeholder: "Full name",
                delay: 0.2,
              },
              {
                icon: <MdEmail className="text-gray-400" size={20} />,
                type: "email",
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value),
                placeholder: "Email address",
                delay: 0.3,
              },
              {
                icon: <MdLock className="text-gray-400" size={20} />,
                type: "password",
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value),
                placeholder: "Password (min 8 characters)",
                delay: 0.4,
              },
              {
                icon: <MdLock className="text-gray-400" size={20} />,
                type: "password",
                value: passwordConfirm,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordConfirm(e.target.value),
                placeholder: "Confirm password",
                delay: 0.5,
              },
            ].map((field, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: field.delay }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female")
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsFillImageFill className="text-gray-400" size={20} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Create Account
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default SignUp;
