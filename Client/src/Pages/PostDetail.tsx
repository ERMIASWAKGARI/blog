import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash, FaImage, FaVideo } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/AuthenticatedNavbar";
import Rating from "../Components/Posts/Rating";
import RelatedPostsSection from "../Components/Posts/RelatedPostsSection";
import SuccessMessage from "../Components/Profile/UserProfile/SuccessMessage";
import { useUser } from "../UserContext";
import { ClipLoader } from "react-spinners";

import generic_image from "../../public/generic_user_place_holder.jpg";
import api from "../axiosConfig";
import moment from "moment";

export interface Post {
  _id: string;
  title: string;
  author: string;
  textContent: string;
  imagePath?: string;
  createdAt: string;
  category: string;
  authorImage: string;
  ratingQuantity: number;
  averageRating: number;
  videoContent?: string;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState<"image" | "video">(
    "image"
  );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/post/getPost/${postId}`);
        const postData = response.data.data.post;
        setPost(postData);

        // Fetch related posts from the same category, excluding current post
        await fetchRelatedPosts(postData.category, postData._id);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching post:", error);
        setSuccessMessage("Error loading post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async (
      category: string,
      excludePostId: string
    ) => {
      try {
        const response = await api.get(
          `/post/getAllposts?category=${category}&limit=10`
        );
        const posts = response.data.data;

        // Filter out current post and limit to 6 related posts
        const filteredPosts = posts
          .filter((p: Post) => p._id !== excludePostId)
          .slice(0, 6);

        setRelatedPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleEdit = (postId: string) => {
    navigate(`/profile/editPost/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(`/post/deletePost/${postId}`);
      setPostToDelete(null);
      setSuccessMessage("Post deleted successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error deleting post:", error);
      setSuccessMessage("Error deleting post. Please try again.");
    }
  };

  const images = post?.imagePath
    ? post.imagePath.split(",").filter((img) => img.trim())
    : [];
  const videos = post?.videoContent
    ? post.videoContent.split(",").filter((vid) => vid.trim())
    : [];

  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const hasMultipleImages = images.length > 1;
  const hasMultipleVideos = videos.length > 1;

  const isAuthor = user && user.name === post?.author;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <ClipLoader size={60} color="#7e22ce" />
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = post.textContent
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");

  const nextMedia = () => {
    if (activeMediaType === "image" && hasMultipleImages) {
      setCurrentMediaIndex((prev) => (prev + 1) % images.length);
    } else if (activeMediaType === "video" && hasMultipleVideos) {
      setCurrentMediaIndex((prev) => (prev + 1) % videos.length);
    }
  };

  const prevMedia = () => {
    if (activeMediaType === "image" && hasMultipleImages) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    } else if (activeMediaType === "video" && hasMultipleVideos) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + videos.length) % videos.length
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Success Message */}
      {successMessage && (
        <div className="container mx-auto px-4 pt-6 max-w-6xl">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 group"
                  >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back</span>
                  </button>

                  {isAuthor && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setPostToDelete(post._id)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.authorImage || generic_image}
                      alt={post.author}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {post.author}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {moment(post.createdAt).format("MMMM D, YYYY")}
                      </p>
                    </div>
                  </div>

                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Media Section */}
              {(hasImages || hasVideos) && (
                <div className="relative bg-gray-900">
                  {/* Media Type Toggle */}
                  {hasImages && hasVideos && (
                    <div className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md rounded-xl p-1">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setActiveMediaType("image")}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            activeMediaType === "image"
                              ? "bg-white text-gray-900"
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <FaImage className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveMediaType("video")}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            activeMediaType === "video"
                              ? "bg-white text-gray-900"
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <FaVideo className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Media Display */}
                  <div className="relative aspect-video flex items-center justify-center">
                    {activeMediaType === "image" && hasImages && (
                      <>
                        <img
                          src={images[currentMediaIndex]}
                          alt={`${post.title} - Image ${currentMediaIndex + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={prevMedia}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                            >
                              <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextMedia}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                            >
                              <FaArrowLeft className="w-5 h-5 rotate-180" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentMediaIndex + 1} / {images.length}
                          </div>
                        )}
                      </>
                    )}

                    {activeMediaType === "video" && hasVideos && (
                      <>
                        <video
                          src={videos[currentMediaIndex]}
                          controls
                          className="w-full h-full object-contain bg-black"
                        />

                        {/* Navigation Arrows */}
                        {hasMultipleVideos && (
                          <>
                            <button
                              onClick={prevMedia}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                            >
                              <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextMedia}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                            >
                              <FaArrowLeft className="w-5 h-5 rotate-180" />
                            </button>
                          </>
                        )}

                        {/* Video Counter */}
                        {hasMultipleVideos && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentMediaIndex + 1} / {videos.length}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed mb-4 text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Rating Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Rating postId={postId} user={user} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedPostsSection
              relatedPosts={relatedPosts}
              category={post.category}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delete Post
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone and all associated data will be permanently removed.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-colors duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(postToDelete)}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
