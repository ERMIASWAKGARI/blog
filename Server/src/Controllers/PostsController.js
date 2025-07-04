const path = require('path')
const express = require('express')
const User = require('../models/userModel')
const APIfeatures = require('../utils/APIFeatures')
const AppError = require('../utils/appError')
const Post = require('../models/postModel')
const asyncWrapper = require('../utils/asyncWrapper')

exports.addPost = asyncWrapper(async (req, res, next) => {
  console.log('Incoming files:', req.files)

  const files = req.files

  if (files?.image && files.image.length > 0) {
    req.body.imagePath =
      files.image[0].path || files.image[0].secure_url || files.image[0].url
  }

  if (files?.video && files.video.length > 0) {
    req.body.videoContent =
      files.video[0].path || files.video[0].secure_url || files.video[0].url
  }

  req.body.author = req.user.name
  req.body.user = req.user.id

  const newPost = await Post.create(req.body)

  res.status(201).json({
    status: 'success',
    message: 'Post created successfully',
    data: {
      newPost,
    },
  })
})

exports.updatePost = asyncWrapper(async (req, res, next) => {
  const postId = req.params.id

  const post = await Post.findById(postId)

  if (!post) {
    return res.status(404).json({
      status: 'fail',
      message: 'Post not found',
    })
  }

  const files = req.files

  if (files.image && files.image.length > 0) {
    const imagePath = files.image[0].path.replace(
      path.join(__dirname, '../../public'),
      ''
    )
    req.body.imagePath = imagePath
  }

  if (files.video && files.video.length > 0) {
    const videoPath = files.video[0].path.replace(
      path.join(__dirname, '../../public'),
      ''
    )
    req.body.videoContent = videoPath
  }

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'User not authorized to update this post',
    })
  }

  req.body.author = req.user.name
  req.body.user = req.user.id

  const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    message: req.file
      ? 'File updated successfully'
      : 'Data updated successfully',
    data: {
      updatedPost,
    },
  })
})

exports.getAllPosts = asyncWrapper(async (req, res, next) => {
  let filter = {}
  if (req.params.userId) filter = { user: req.params.userId }

  let initialQuery = Post.find(filter)

  const countFeatures = new APIfeatures(initialQuery, req.query)
    .filter()
    .search()
    .sort()

  const totalPosts = await countFeatures.query.countDocuments()

  const dataFeatures = new APIfeatures(Post.find(filter), req.query)
    .filter()
    .search()
    .sort()
    .limit()
    .paginate()

  const posts = await dataFeatures.query

  res.status(200).json({
    status: 'success',
    result: posts.length,
    totalPosts,
    data: posts,
  })
})

exports.getPost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate('user')

  res.status(200).json({
    status: 'Success',
    data: {
      post,
    },
  })
})

exports.deletePost = asyncWrapper(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.postId)

  if (!post) {
    return next(new AppError('No post found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.getMyPost = asyncWrapper(async (req, res, next) => {
  const myPost = await Post.find({ user: req.user._id })

  if (!myPost) {
    return next(new AppError('You have not posted so far', 404))
  }

  res.status(201).json({
    status: 'success',
    data: {
      myPost,
    },
  })
})

exports.deleteAllMyPost = asyncWrapper(async (req, res, next) => {
  const posts = await Post.deleteMany({ user: req.user.id })

  if (!posts) {
    return next(new AppError('You have no post', 404))
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { numberOfPosts: 0 },
    { new: true, runValidators: true }
  )

  res.status(201).json({
    status: 'success',
    message: 'All your posts are delete',
    data: null,
  })
})
