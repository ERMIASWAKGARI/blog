/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IconType } from "react-icons";
import { FaEdit, FaCheck } from "react-icons/fa";

interface UserProfileFieldProps {
  label: string;
  field: string;
  type: string;
  icon: IconType;
  currentUser: any;
  editField: string | null;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent, field: string) => void;
  handleEdit: (field: string) => void;
  error: string | null;
}

const UserProfileField: React.FC<UserProfileFieldProps> = ({
  label,
  field,
  type,
  icon: Icon,
  currentUser,
  editField,
  formData,
  handleChange,
  handleSubmit,
  handleEdit,
  error,
}) => {
  const isEditing = editField === field;

  return (
    <form
      onSubmit={(e) => handleSubmit(e, field)}
      className="p-4 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </label>

        {isEditing ? (
          <div className="flex flex-col space-y-3">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <Icon className="h-5 w-5" />
              </div>
              <input
                type={type}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => handleEdit("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaCheck className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="text-indigo-500">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-gray-800">
                {currentUser[field] || (
                  <span className="text-gray-400">Not set</span>
                )}
              </span>
            </div>
            <button
              onClick={() => handleEdit(field)}
              className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50"
              aria-label="Edit post"
            >
              <FaEdit />
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-1 animate-fade-in">{error}</p>
        )}
      </div>
    </form>
  );
};

export default UserProfileField;
