const express = require('express')
const {
  changePassword,
} = require('../Controllers/profileController/setting/changePassword')

const {
  changeName,
  changeEmail,
  deleteUserAccount,
} = require('../Controllers/profileController/setting/changeAccount')

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../Controllers/authController')
const fileUpload = require('../middleware/multer')

const {
  getMe,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../Controllers/userController')

const postRouter = require('./postRoutes')

const router = express.Router()

router.use('/:userId/post', postRouter)

router.post('/signup', fileUpload.single('photo'), signup)
router.post('/login', login)
router.post('/forgotpassword', forgotPassword)
router.patch('/resetpassword/:token', resetPassword)

router.use(protect)

router.patch('/updatePassword', changePassword)
router.patch('/updateEmail', changeEmail)
router.patch('/changeName', changeName)
router.delete('/deleteMe', deleteUserAccount)
router.get('/me', getUser)

router.use(restrictTo('admin'))

router.route('/').get(getAllUsers)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
