/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { IconType } from "react-icons";
import femaleDefault from "../../../../public/jane_smith.png";
import maleDefault from "../../../../public/john_doe.png";

interface UserProfilePhotoProps {
  currentUser: any;
  editField: string | null;
  handleEdit: (field: string) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent, field: string) => void;
  icon: IconType;
}

const UserProfilePhoto: React.FC<UserProfilePhotoProps> = ({
  currentUser,
  editField,
  handleEdit,
  handlePhotoChange,
  handleSubmit,
  icon: Icon,
}) => {
  const photoSrc = currentUser?.photo
    ? `${currentUser.photo}`
    : currentUser.gender === "female"
    ? femaleDefault
    : maleDefault;

  const isEditing = editField === "photo";

  return (
    <form
      onSubmit={(e) => handleSubmit(e, "photo")}
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Profile Photo
            </h3>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={photoSrc}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {!isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={() => handleEdit("photo")}
                className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                aria-label="Change profile photo"
              >
                <Icon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="w-full space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="photo-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Upload new photo
              </label>
              <input
                id="photo-upload"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => handleEdit("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default UserProfilePhoto;
