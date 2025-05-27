const express = require('express')
const { login, protect, restrictTo } = require('../Controllers/authController')
const { deletePost, getAllPosts } = require('../Controllers/PostsController')
const { getAdminDashboard } = require('../Controllers/adminController')
const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../Controllers/userController')

const router = express.Router()

router.post('/login', login)

router.use(protect)
router.use(restrictTo('admin'))

router.get('/dashboard', getAdminDashboard)

router.route('/').get(getAllUsers)

router.get('/getAllposts', getAllPosts)
router.delete('/deletePost/:postId', protect, deletePost)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
