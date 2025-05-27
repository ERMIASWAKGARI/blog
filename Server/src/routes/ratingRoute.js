const express = require('express')
const { protect, restrictTo } = require('../Controllers/authController')
const {
  getAllRating,
  updateRating,
  deleteRating,
  addRating,
} = require('../Controllers/RatingController')

const router = express.Router({ mergeParams: true })

router.route('/').post(protect, restrictTo('user'), addRating)

router
  .route('/:id')
  .get(protect, getAllRating)
  .patch(protect, restrictTo('user'), updateRating)
  .delete(protect, deleteRating)

module.exports = router
