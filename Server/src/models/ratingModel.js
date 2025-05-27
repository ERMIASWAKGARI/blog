const mongoose = require('mongoose')
const Post = require('./postModel')

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Rating must belong to a post'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Rating must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

ratingSchema.index({ post: 1, user: 1 }, { unique: true })

ratingSchema.statics.calcAverageRating = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: '$post',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])
  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      ratingQuantity: stats[0].nRating,
      averageRating: stats[0].avgRating,
    })
  } else {
    await Post.findByIdAndUpdate(postId, {
      ratingQuantity: 0,
      averageRating: 4.5,
    })
  }
}

ratingSchema.post('save', function () {
  this.constructor.calcAverageRating(this.post)
})

ratingSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.post)
  }
})

ratingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.post)
  }
})

const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating
