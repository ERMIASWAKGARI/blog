import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import SocialMediaIcons from "./SocialMediaIcons";

interface Props {
  id: string;
}

const NewsletterSection: React.FC<Props> = ({ id }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setEmail("");
    setIsSubmitting(false);

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section
      id={id}
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Stay <span className="text-purple-400">Updated</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Get the latest tech insights and articles delivered to your inbox
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 focus:outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.form>

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-8"
              >
                Thanks for subscribing! Please check your email to confirm.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-400 mb-4">Or follow us on social media</p>
            <SocialMediaIcons />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
