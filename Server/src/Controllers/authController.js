const crypto = require('crypto')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const { promisify } = require('util')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const asyncWrapper = require('../utils/asyncWrapper')
const sendEmail = require('../utils/email')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.signup = asyncWrapper(async (req, res, next) => {
  try {
    const newUser = await User.create({
      ...req.body,
      photo: req.file?.path || req.file?.secure_url || req.file?.url,
    })

    createSendToken(newUser, 201, res)
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return next(
        new AppError('Email already in use. Please use a different email.', 400)
      )
    }
    next(error)
  }
})

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400))
  }

  createSendToken(user, 201, res)
})

exports.protect = asyncWrapper(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in. Please log in first to get access',
        401
      )
    )
  }

  const JWT_SECRET = process.env.JWT_SECRET

  const verifyAsync = promisify(jwt.verify)

  const decode = await verifyAsync(token, JWT_SECRET)

  const currentUser = await User.findById(decode.id)
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }
    next()
  }
}

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    )
  }

  res.status(201).json({
    status: 'success',
    message: 'Token has been sent to the email',
  })
})

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  createSendToken(user, 201, res)
})

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401))
  }

  user.password = req.body.newPassword
  user.passwordConfirm = req.body.newPasswordConfirm
  await user.save()

  createSendToken(user, 200, res)
})

const uploadDirectory = path.join(__dirname, '../../public/uploads')
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

exports.upload = multer({ storage: storage })
