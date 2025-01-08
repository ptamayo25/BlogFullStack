const express = require("express");
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all posts with pagination
router.get("/", protect, getPosts); // GET /api/posts

// Fetch a single post by ID
router.get("/:id", protect, getPostById); // GET /api/posts/:id

// Create a new post
router.post("/", protect, createPost); // POST /api/posts

//Update a post by ID
router.put("/:id", protect, updatePost); // PUT /api/posts/:id

// TODO
// Import functions implemented in postController.js that are associated with update and delete post functionalities
// Add routes for Update and Delete functionalities

module.exports = router;
