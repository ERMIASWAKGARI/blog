const AppError = require('../utils/appError')
const mongoose = require('mongoose')

// Helper function to handle cast errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

// Helper function to handle duplicate field errors
const handleDuplicateFields = (err) => {
  const val = err.keyValue.name // Adjust as needed for your schema
  const message = `Duplicate field value: ${val}. Please use another value.`
  return new AppError(message, 400)
}

// Helper function to handle validation errors
const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid data values. ${errors.join('. ')}`
  return new AppError(message, 404)
}

// Helper function to handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401)

// Helper function to handle expired JWT errors
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

// Function to send error response in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

// Function to send error response in production mode
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err)
    if (err.code === 11000) err = handleDuplicateFields(err)
    if (err.name === 'ValidationError') err = handleValidateErrorDB(err)
    if (err.name === 'JsonWebTokenError') err = handleJWTError()
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

    sendErrorProd(err, res)
  }
}

module.exports = globalErrorHandler
