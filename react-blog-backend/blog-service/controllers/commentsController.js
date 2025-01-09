// TODO
// 1. Import Models
      // Objective: Use Mongoose models for comments and posts.
      // Steps:
          // Ensure Comment and Post models are imported.

// 2. Fetch All Comments for a Post
      // Objective: Retrieve all comments associated with a specific post ID.
      // Steps:
          // Use Comment.find() to fetch comments where post matches req.params.id.
          // Use populate() to include details about the author (e.g., name and email).
          // Handle errors by wrapping the logic in a try...catch block.
          // Return the fetched comments as a JSON response.

// 3. Fetch a Single Comment by ID
      // Objective: Retrieve a specific comment using its ID.
      // Steps:
          // Use Comment.findById() to fetch the comment by req.params.id.
          // Use populate() to include author details.
          // Check if the comment exists; if not, return a 404 Not Found response.
          // Handle errors and return a JSON response with the comment or error message.

// 4. Add a New Comment
      // Objective: Add a comment to a specific post.
      // Steps:
          // Extract content from req.body.
          // Use Post.findById() to verify the existence of the post associated with req.params.id.
          // Create a new comment with the content, author (from req.user.id), and post ID.
          // Save the comment using comment.save().
          // Update the post's comments array by pushing the new comment's ID and saving the post.
          // Handle errors and return a success response with the created comment.

// 5. Edit a Comment
      // Objective: Allow the author to edit their comment.
      // Steps:
          // Use Comment.findById() to fetch the comment by req.params.id.
          // Verify the comment exists; if not, return a 404 Not Found response.
          // Check if the logged-in user (req.user.id) matches the comment's author.
          // Update the comment's content with the new value from req.body.content.
          // Save the updated comment using comment.save().
          // Handle errors and return a success response with the updated comment.

// 6. Delete a Comment
      // Objective: Allow the author to delete their comment.
      // Steps:
          // Use Comment.findById() to fetch the comment by req.params.id.
          // Verify the comment exists; if not, return a 404 Not Found response.
          // Check if the logged-in user (req.user.id) matches the comment's author.
          // Use comment.deleteOne() to delete the comment from the database.
          // Update the associated post by removing the comment ID from its comments array using Post.updateOne() with $pull.
          // Handle errors and return a success response.

// 7. Integrate with Routes
      // Objective: Connect these controller functions to the Express routes.
      // Steps:
          // Import these functions into the comments router file.
          // Define the routes and attach the corresponding controller functions:
          // GET /comments/:id → getComments
          // POST /comments/:id → addComment
          // PUT /comments/:id → editComment
          // DELETE /comments/:id → deleteComment

const mongoose = require("mongoose");
const logger = require("../blogLogs/logger");
const Comment = mongoose.model("Comment");
const Post = mongoose.model("Post");

// Fetch All Comments for a Post
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "author",
      "name email"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a Single Comment by ID
exports.getCommentbyID = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("author");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a New Comment
exports.addComment = async (req, res) => {
  try {
    const content = req.body.content;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      content: content,
      author: req.user.id,
      postId: postId,
    });

    await comment.save();
    post.comments.push(comment.id);
    await post.save();

    logger.info("Comment added successfully", { commentId: comment._id });
    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a Comment
exports.editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (req.user.id !== comment.author.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
    }

    comment.content = req.body.content;
    await comment.save();

    logger.info("Comment updated successfully", { commentId: comment._id });
    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (req.user.id !== comment.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await comment.deleteOne();
    await Post.updateOne(
      { comments: req.params.id },
      { $pull: { comments: req.params.id } }
    );

    logger.info("Comment deleted successfully", { commentId: comment._id });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


          