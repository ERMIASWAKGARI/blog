import React from "react";
import { motion } from "framer-motion";
import author1 from "../../../public/john_doe.png";
import author2 from "../../../public/jane_smith.png";
import author3 from "../../../public/mickael_brown.png";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

interface Author {
  name: string;
  role: string;
  description: string;
  image: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface Props {
  id: string;
}

const AuthorsSection: React.FC<Props> = ({ id }) => {
  const authors: Author[] = [
    {
      name: "John Doe",
      role: "Senior Developer",
      description:
        "John is an experienced developer with a passion for building scalable applications and mentoring junior engineers.",
      image: author1,
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Jane Smith",
      role: "Data Scientist",
      description:
        "Jane specializes in machine learning and data visualization, transforming complex data into actionable insights.",
      image: author2,
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
    {
      name: "Michael Brown",
      role: "Cybersecurity Expert",
      description:
        "Michael helps organizations strengthen their security posture through penetration testing and security audits.",
      image: author3,
      social: {
        github: "#",
        twitter: "#",
        linkedin: "#",
      },
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
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
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section
      id={id}
      className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-purple-600">Expert Authors</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented professionals behind our insightful tech content
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {authors.map((author, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100 shadow-md">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {author.name}
                </h3>
                <p className="text-indigo-600 mb-4">{author.role}</p>
                <p className="text-gray-600 mb-6">{author.description}</p>

                <div className="flex space-x-4">
                  {author.social.github && (
                    <a
                      href={author.social.github}
                      className="text-gray-500 hover:text-purple-600 transition-colors"
                      aria-label="GitHub"
                    >
                      <FiGithub className="text-xl" />
                    </a>
                  )}
                  {author.social.twitter && (
                    <a
                      href={author.social.twitter}
                      className="text-gray-500 hover:text-purple-600 transition-colors"
                      aria-label="Twitter"
                    >
                      <FiTwitter className="text-xl" />
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a
                      href={author.social.linkedin}
                      className="text-gray-500 hover:text-purple-600 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin className="text-xl" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AuthorsSection;
