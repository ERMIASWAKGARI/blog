import React from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import testimony1 from "../../../public/john_doe.png";
import testimony2 from "../../../public/jane_smith.png";
import testimony3 from "../../../public/mickael_brown.png";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    title: "CEO, Tech Solutions Inc.",
    quote:
      "Debbal Technologies has been instrumental in helping us stay ahead with their insightful articles and expert analysis.",
    imageUrl: testimony1,
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Data Scientist",
    quote:
      "The articles on Debbal Technologies have been invaluable in my career growth. They cover the latest trends in an accessible manner.",
    imageUrl: testimony2,
  },
  {
    id: 3,
    name: "Michael Brown",
    title: "Cybersecurity Analyst",
    quote:
      "I rely on Debbal Technologies for up-to-date information on cybersecurity threats and best practices. Highly recommended!",
    imageUrl: testimony3,
  },
];

interface Props {
  id: string;
}

const TestimonialsSection: React.FC<Props> = ({ id }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id={id}
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-purple-600">Readers Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from professionals who rely on our content for their tech
            insights
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-8 md:p-10 flex flex-col items-center text-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-100 shadow-md">
                  <img
                    src={testimonials[currentIndex].imageUrl}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full text-white">
                  <FiMessageSquare className="text-lg" />
                </div>
              </div>

              <div className="prose prose-lg text-gray-700 mb-6">
                <p>"{testimonials[currentIndex].quote}"</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-indigo-600">
                  {testimonials[currentIndex].title}
                </p>
              </div>
            </motion.div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiChevronLeft className="text-gray-700 text-xl" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiChevronRight className="text-gray-700 text-xl" />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
