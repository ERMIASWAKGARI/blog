const Post = require('../../../models/postModel')
const asyncWrapper = require('../../../utils/asyncWrapper')
const User = require('../../../models/userModel')
const AppError = require('../../../utils/appError')

// Handler for changing email
exports.changeEmail = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  )

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

// Handler for changing name
exports.changeName = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  // Update the user's name in all their posts
  await Post.updateMany(
    { user: req.user.id },
    { $set: { author: req.body.name } }
  )

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

exports.deleteUserAccount = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id

  // Delete the user
  const user = await User.findByIdAndDelete(userId)
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  // Delete the user's posts
  await Post.deleteMany({ user: userId })

  res
    .status(200)
    .json({ message: 'Account and associated posts deleted successfully' })
})
