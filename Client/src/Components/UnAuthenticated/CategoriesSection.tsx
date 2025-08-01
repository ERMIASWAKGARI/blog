import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

interface Props {
  id: string;
  categories: string[];
}

const CategoriesSection: React.FC<Props> = ({ id, categories }) => {
  return (
    <section
      id={id}
      className="py-20 bg-gradient-to-br from-blue-50 to-blue-100"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Blog Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insightful content across various technology topics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category}`}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-xl hover:-translate-y-2"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="p-8 h-full flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-purple-700">
                    {category}
                  </h3>
                  <p className="text-gray-600 mb-6 transition-colors duration-300 group-hover:text-gray-800">
                    Discover the latest articles and insights on{" "}
                    {category.toLowerCase()}.
                  </p>
                </div>

                <div className="flex items-center text-purple-600 font-medium transition-all duration-300 group-hover:text-purple-800 group-hover:translate-x-1">
                  <span>Explore {category}</span>
                  <FaAngleRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              {/* Animated border bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
