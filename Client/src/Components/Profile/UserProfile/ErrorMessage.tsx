import React, { useEffect } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTimeout?: number;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
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
                 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-md
                 flex items-start gap-3 animate-fade-in z-50"
      role="alert"
    >
      {/* Error icon */}
      <FiAlertTriangle className="flex-shrink-0 mt-0.5 text-red-500" />

      {/* Message content */}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="text-red-500 hover:text-red-700 p-1 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        aria-label="Close error message"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;
