const bcrypt = require('bcrypt')
const asyncWrapper = require('../../../utils/asyncWrapper')
const User = require('../../../models/userModel')
const AppError = require('../../../utils/appError')

exports.changePassword = asyncWrapper(async (req, res, next) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body

  const user = await User.findById(req.user._id).select('+password')

  // Check if user exists
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  // Compare the provided old password with the stored hashed password
  const isMatch = await bcrypt.compare(oldPassword, user.password)
  if (!isMatch) {
    return next(new AppError('Old password is incorrect', 400))
  }

  // Update the password in the user document
  user.password = newPassword
  user.passwordConfirm = passwordConfirm

  try {
    await user.save()
    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    next(new AppError(error.message, 400))
  }
})
