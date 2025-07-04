const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'blog_uploads'

    // If this is a profile photo, change the folder
    if (file.fieldname === 'photo') {
      folder = 'user_profiles'
    }

    return {
      folder,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'webm'],
      public_id: `${file.fieldname}-${Date.now()}`,
    }
  },
})

const fileUpload = multer({ storage })

module.exports = fileUpload
