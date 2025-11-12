import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../PostCard";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import api from "../../axiosConfig";

interface Post {
  _id: string;
  title: string;
  author: string;
  textContent: string;
  imagePath: string;
  postedAt: string;
  createdAt: string;
  category: string;
  authorImage: string;
  ratingQuantity: number;
  averageRating: number;
}

const categories = [
  "All",
  "AI",
  "Software Development",
  "Cloud Computing",
  "Data Science",
  "Blockchain",
  "Internet of Things (IoT)",
  "DevOps",
  "Quantum Computing",
  "Cybersecurity",
];

const sortOptions = [
  { label: "Latest", value: "date" },
  { label: "Highest Rated", value: "rating" },
  { label: "Category", value: "category" },
  { label: "Title A-Z", value: "title" },
];

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("date");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const postListRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category") || "All";
    const sortParam = params.get("sort") || "date";
    const pageParam = parseInt(params.get("page") || "1", 10);
    const searchParam = params.get("search") || "";

    setSelectedCategory(categoryParam);
    setSort(sortParam);
    setCurrentPage(pageParam);
    setSearchQuery(searchParam);

    const fetchPostsFromUrl = async () => {
      setLoading(true);
      try {
        let url = `/post/getAllposts?page=${pageParam}&limit=9`;
        if (categoryParam !== "All") url += `&category=${categoryParam}`;
        url += `&sort=${sortParam}`;
        if (searchParam) url += `&search=${encodeURIComponent(searchParam)}`;

        const response = await api.get(url);
        const data = await response.data;
        setPosts(data.data);
        setTotalPages(Math.ceil(data.totalPosts / 9));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPostsFromUrl();
  }, [location.search]);

  const updateUrlParams = (
    category: string,
    sort: string,
    page: number,
    search: string
  ) => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    params.set("sort", sort);
    params.set("page", page.toString());
    if (search) params.set("search", search);

    navigate({ search: params.toString() });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateUrlParams(selectedCategory, sort, pageNumber, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrlParams(category, sort, 1, searchQuery);
    setIsCategoryDropdownOpen(false);
  };

  const handleSortSelect = (sortOption: string) => {
    setSort(sortOption);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, searchQuery);
    setIsSortDropdownOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sort, 1, searchQuery);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            currentPage === i
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <section
      id="latest-posts"
      ref={postListRef}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insightful content from our community of technology experts
            and enthusiasts
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/60">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1 lg:flex-none">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
                    className="w-full lg:w-64 flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl text-left shadow-sm hover:border-gray-400 transition-colors duration-200"
                  >
                    <span className="text-gray-700">{selectedCategory}</span>
                    <FaFilter className="w-4 h-4 text-gray-400" />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="max-h-60 overflow-y-auto py-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                              selectedCategory === category
                                ? "bg-purple-50 text-purple-600 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="relative flex-1 lg:flex-none">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full lg:w-64 flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl text-left shadow-sm hover:border-gray-400 transition-colors duration-200"
                  >
                    <span className="text-gray-700">
                      {sortOptions.find((opt) => opt.value === sort)?.label}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isSortDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortSelect(option.value)}
                          className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                            sort === option.value
                              ? "bg-purple-50 text-purple-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Articles
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full lg:w-80 px-4 py-3 pl-11 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-200"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <ClipLoader color="#9333ea" size={60} />
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create a post in our community"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex space-x-1">{renderPageNumbers()}</div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PostsList;
