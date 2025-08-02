import React, { useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTimeout?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
  autoClose = true,
  autoCloseTimeout = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTimeout);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTimeout, onClose]);

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md
                 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md
                 flex items-start gap-3 animate-fade-in z-50"
      role="alert"
    >
      {/* Check icon */}
      <FaCheckCircle className="flex-shrink-0 mt-0.5 text-green-500 text-lg" />

      {/* Message content */}
      <div className="flex-1">
        <h3 className="text-sm font-medium">Success</h3>
        <p className="mt-1 text-sm">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="text-green-500 hover:text-green-700 p-1 rounded-full
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
        aria-label="Close notification"
      >
        <FaTimes className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SuccessMessage;
