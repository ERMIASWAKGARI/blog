const User = require('../models/userModel')
const asyncWrapper = require('../utils/asyncWrapper')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/APIFeatures')
const userAPIFeatures = require('../utils/userAPIFeatures')

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const features = new userAPIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate()
    .search()

  const users = await features.query

  const totalUsers = await User.countDocuments()

  res.status(200).json({
    status: 'success',
    result: users.length,
    totalUsers,
    data: {
      data: users,
    },
  })
})

exports.getUser = asyncWrapper(async (req, res, next) => {
  if (!req.params.id) req.params.id = req.user.id
  const user = await User.findById(req.params.id).populate('posts')

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    satus: 'success',
    data: {
      data: user,
    },
  })
})

exports.updateUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})
