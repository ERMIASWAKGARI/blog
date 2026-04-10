const Rating = require("../models/ratingModel");
const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/appError");
const Post = require("../models/postModel");
const APIFeatures = require("../utils/APIFeatures");

// Helper function to calculate average ratings
const calculatePostRatings = async (postId) => {
  const ratings = await Rating.find({ post: postId });

  if (ratings.length === 0) {
    return { averageRating: 0, ratingQuantity: 0 };
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRating / ratings.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratingQuantity: ratings.length,
  };
};

exports.addRating = asyncWrapper(async (req, res, next) => {
  if (!req.body.post) req.body.post = req.body.postId;
  if (!req.body.user) req.body.user = req.user.id;

  const post = await Post.findById(req.body.post);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if user is trying to rate their own post
  if (String(post.user) === String(req.user.id)) {
    return next(new AppError("You can't rate your own post", 400));
  }

  // Check if user already rated this post
  const existingRating = await Rating.findOne({
    post: req.body.post,
    user: req.user.id,
  });

  if (existingRating) {
    return next(new AppError("You have already rated this post", 400));
  }

  const rating = await Rating.create(req.body);

  // Update post ratings
  const newRatings = await calculatePostRatings(req.body.post);
  await Post.findByIdAndUpdate(req.body.post, newRatings);

  res.status(200).json({
    status: "Success",
    data: {
      data: rating,
    },
  });
});

exports.deleteRating = asyncWrapper(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return next(new AppError("No rating found with that ID", 404));
  }

  // Check if user owns the rating
  if (String(rating.user) !== String(req.user.id)) {
    return next(new AppError("You can only delete your own ratings", 403));
  }

  await Rating.findByIdAndDelete(req.params.id);

  // Update post ratings
  const newRatings = await calculatePostRatings(rating.post);
  await Post.findByIdAndUpdate(rating.post, newRatings);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateRating = asyncWrapper(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return next(new AppError("No rating found with that ID", 404));
  }

  // Check if user owns the rating
  if (String(rating.user) !== String(req.user.id)) {
    return next(new AppError("You can only update your own ratings", 403));
  }

  const updatedRating = await Rating.findByIdAndUpdate(
    req.params.id,
    { rating: req.body.rating },
    {
      new: true,
      runValidators: true,
    }
  );

  // Update post ratings
  const newRatings = await calculatePostRatings(rating.post);
  await Post.findByIdAndUpdate(rating.post, newRatings);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedRating, // Fixed: return as 'data' to match frontend expectation
    },
  });
});

exports.getAllRating = asyncWrapper(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId };

  const features = new APIFeatures(Rating.find(filter), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const ratings = await features.query
    .populate({ path: "post", select: "user" })
    .populate({ path: "user", select: "name" });

  res.status(200).json({
    status: "success",
    result: ratings.length,
    data: {
      data: ratings,
    },
  });
});

// Get user's rating for a specific post
exports.getUserRating = asyncWrapper(async (req, res, next) => {
  const rating = await Rating.findOne({
    post: req.params.postId,
    user: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: rating,
    },
  });
});
