const Rating = require('../models/ratingModel')
const asyncWrapper = require('../utils/asyncWrapper')
const AppError = require('../utils/appError')
const Post = require('../models/postModel')
const APIFeatures = require('../utils/APIFeatures')

exports.addRating = asyncWrapper(async (req, res, next) => {
  if (!req.body.post) req.body.post = req.body.postId
  if (!req.body.user) req.body.user = req.user.id

  const post = await Post.findById(req.body.post)

  if (req.user.id === String(post?.user)) {
    return next(new AppError("you can't rate your post", 404))
  }

  const rating = await Rating.create(req.body)
  res.status(200).json({
    status: 'Success',
    data: {
      data: rating,
    },
  })
})

exports.deleteRating = asyncWrapper(async (req, res, next) => {
  const rate = await Rating.findByIdAndDelete(req.params.id)

  if (!rate) {
    return next(new AppError('No document found with that ID', 404))
  }

  if (req.user.id != String(rate?.user)) {
    return next(
      new AppError(
        'You cannot delete these rating because it is not yours',
        404
      )
    )
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.updateRating = asyncWrapper(async (req, res, next) => {
  const rate = await Rating.findById(req.params.id)
  if (!req.body.user) req.body.user = req.user.id

  if (req.user.id != String(rate?.user)) {
    return next(
      new AppError(
        'You cannot update these rating because it is not yours',
        404
      )
    )
  }

  const updatedrating = await Rating.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!updatedrating) {
    return next(new AppError('No rating found with that ID', 404))
  }

  if (req.user.id != String(rate?.user)) {
    return next(
      new AppError(
        'You cannot delete these rating because it is not yours',
        404
      )
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedrating,
    },
  })
})

exports.getAllRating = asyncWrapper(async (req, res, next) => {
  let filter = {}
  if (req.params.postId) filter = { post: req.params.postId }

  const features = new APIFeatures(Rating.find(filter), req.query)
    .filter()
    .sort()
    .limit()
    .paginate()

  const reviews = await features.query
    .populate({ path: 'post', select: 'author' })
    .populate({ path: 'user', select: 'name' })

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      data: reviews,
    },
  })
})
