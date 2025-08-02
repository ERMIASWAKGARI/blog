/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaCheck } from "react-icons/fa";

interface PasswordChangeFormProps {
  currentUser: any;
  editField: string | null;
  handleEdit: (field: string | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent, field: string) => void;
  formData: any;
  fieldErrors: Record<string, string | null>;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  handleChange,
  handleSubmit,
  handleEdit,
  formData,
  fieldErrors,
}) => (
  <form
    onSubmit={(e) => handleSubmit(e, "password")}
    className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>

    <div className="space-y-5">
      {/* Old Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword || ""}
            onChange={handleChange}
            className={`block w-full px-4 py-2 border ${
              fieldErrors.oldPassword ? "border-red-300" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
            required
            placeholder="Enter current password"
          />
          {fieldErrors.oldPassword && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">
              {fieldErrors.oldPassword}
            </p>
          )}
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword || ""}
            onChange={handleChange}
            className={`block w-full px-4 py-2 border ${
              fieldErrors.newPassword ? "border-red-300" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
            required
            placeholder="Enter new password"
          />
          {fieldErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">
              {fieldErrors.newPassword}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm || ""}
            onChange={handleChange}
            className={`block w-full px-4 py-2 border ${
              fieldErrors.passwordConfirm ? "border-red-300" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
            required
            placeholder="Confirm new password"
          />
          {fieldErrors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">
              {fieldErrors.passwordConfirm}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => handleEdit(null)}
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaCheck className="mr-2" />
          Update Password
        </button>
      </div>
    </div>
  </form>
);

export default PasswordChangeForm;
