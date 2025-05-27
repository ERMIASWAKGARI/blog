const User = require('../models/userModel')
const Post = require('../models/postModel')
const asyncWrapper = require('../utils/asyncWrapper')

exports.getAdminDashboard = asyncWrapper(async (req, res, next) => {
  const userCount = await User.countDocuments()
  const postCount = await Post.countDocuments()
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5)
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5)

  res.status(200).json({
    status: 'success',
    data: {
      userCount,
      postCount,
      recentUsers,
      recentPosts,
    },
  })
})
