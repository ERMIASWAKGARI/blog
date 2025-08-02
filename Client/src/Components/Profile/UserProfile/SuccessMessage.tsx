import React from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => (
  <div
    className="relative flex items-start gap-3 p-4 pr-10 mb-6
               bg-green-50 border border-green-200 rounded-lg
               animate-fade-in"
    role="alert"
  >
    {/* Check icon */}
    <FaCheckCircle className="flex-shrink-0 mt-0.5 text-green-500 text-lg" />

    {/* Message content */}
    <div className="flex-1">
      <h3 className="text-sm font-medium text-green-800">Success</h3>
      <p className="mt-1 text-sm text-green-700">{message}</p>
    </div>

    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 p-1 text-green-500 hover:text-green-700 rounded-full
                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
      aria-label="Close notification"
    >
      <FaTimes className="h-4 w-4" />
    </button>
  </div>
);

export default SuccessMessage;
