import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface PostHeaderProps {
  ratingQuantity: number;
  averageRating: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  ratingQuantity,
  averageRating,
}) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faStar}
          className="text-yellow-400 w-4 h-4 mr-1"
        />
        <span className="font-medium text-gray-700">
          {averageRating.toFixed(1)}
        </span>
        <span className="mx-1 text-gray-400">|</span>
        <span className="text-gray-500">
          {ratingQuantity} {ratingQuantity === 1 ? "rating" : "ratings"}
        </span>
      </div>
    </div>
  );
};

export default PostHeader;
