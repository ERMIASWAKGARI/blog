const express = require("express");
const ratingRoute = require("./ratingRoute");
const { getAllPosts } = require("../Controllers/PostsController");
const {
  addPost,
  getMyPost,
  deleteAllMyPost,
  getPost,
  deletePost,
  updatePost,
} = require("../Controllers/PostsController");
const { protect, upload } = require("../Controllers/authController");
const fileUpload = require("../middleware/multer");

const router = express.Router({ mergeParams: true });

router.use("/:postId/rating", ratingRoute);

router.post(
  "/addPost",
  protect,
  (req, res, next) => {
    fileUpload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ status: "fail", message: err.message });
      }
      next();
    });
  },
  addPost
);

router.get("/getAllposts", getAllPosts);
router.patch(
  "/update/:id",
  protect,
  (req, res, next) => {
    fileUpload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ status: "fail", message: err.message });
      }
      next();
    });
  },
  updatePost
);
router.get("/getMyPost", protect, getMyPost);
router.get("/getPost/:postId", protect, getPost);
router.get("/getPost/:postId", getPost);
router.delete("/deletePost/:postId", protect, deletePost);
router.delete("/deleteAllMyPost", protect, deleteAllMyPost);
router.delete("/user/:userId/deletePost/:postId", protect, deletePost);

module.exports = router;
