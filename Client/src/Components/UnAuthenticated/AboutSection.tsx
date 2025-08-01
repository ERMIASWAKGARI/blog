import React from "react";
import { FiEye, FiTarget, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

interface Props {
  id: string;
}

const AboutSection: React.FC<Props> = ({ id }) => {
  const cards = [
    {
      icon: <FiEye className="text-2xl" />,
      title: "Our Vision",
      items: [
        "Become the ultimate destination for tech insights",
        "Provide comprehensive tutorials for all skill levels",
        "Stay ahead with the latest technological advancements",
      ],
    },
    {
      icon: <FiTarget className="text-2xl" />,
      title: "Our Mission",
      items: [
        "Empower tech enthusiasts, professionals, and learners",
        "Deliver valuable insights through curated content",
        "Promote continuous learning and skill development",
      ],
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: "Stay Updated",
      items: [
        "Keep readers informed with latest industry trends",
        "Offer insights on emerging technologies",
        "Provide practical tech navigation advice",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id={id}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          About <span className="text-purple-600">Debbal Tech Gazette</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center mb-6 space-x-3">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h3>
                </div>
                <ul className="space-y-4 flex-grow">
                  {card.items.map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      variants={itemVariants}
                    >
                      <FiCheckCircle className="text-purple-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering high-quality tech content that
            educates, inspires, and helps our community stay at the forefront of
            technology innovation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
