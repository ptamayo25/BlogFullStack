/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment"; // Import moment.js for date formatting
import styles from "./CommentSection.module.css";
// import { set } from "mongoose";
// import { post } from "../../../../react-blog-backend/blog-service/routes/postRoutes";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]); // State to store fetched comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [editComment, setEditComment] = useState(null); // State for the comment being edited
  const [hideComment, setHideComment] = useState(false); // Toggle visibility of comments
  const [sortOption, setSortOption] = useState("newest"); // Sorting option for comments
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // useEffect hook to fetch and display comments for a specific post.  The dependency array [postId] ensures this runs whenever the postId changes  This hook is used to perform side effects in functional components, such as fetching data, subscribing to events, or manually changing the DOM.
  useEffect(() => {
    // Define an asynchronous function to fetch comments from the API.  Asynchronous functions allow you to work with promises and await their resolution.  This makes asynchronous code easier to read and reason about.
    const fetchComments = async () => {
      // TODO
      // Access the authentication token from localStorage. If the token does not exist, alert the user and halt further execution.
      // Use the postId to construct the API URL. This URL should point to the endpoint responsible for fetching comments.
      // Make a GET request to the API with the token included in the Authorization header.
      // Parse the response data and update the component's comments state with the fetched data.
      // Handle any errors during the request gracefully, logging them for debugging purposes.

      setLoading(true); // Set loading state to true while fetching comments

      try {
        const { token } = JSON.parse(localStorage.getItem("auth_user")); // Retrieve the authentication token from localStorage

        // Check if token exists, if not alert user and return
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        // Construct the API URL for fetching comments based on the postId
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        //Check if the response is ok throw error if not
        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }

        // Parse the response data as JSON
        const data = await response.json();

        // Update the comments state with the fetched data
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        alert(error.message || "An error occurred while fetching comments.");
      } finally {
        setLoading(false); // Set loading state to false after fetching comments
      }
    };

    // Call the fetchComments function to initiate the comment fetching process.
    fetchComments();
    // Specify the postId as a dependency for the useEffect hook. This ensures that the effect runs whenever the postId changes.  If the postId changes, the component needs to fetch the comments for the new post
  }, [postId]);

  // Function to handle adding a new comment
  const handleAddComment = async (e) => {
    //  TODO
    // Access the authentication token and the user ID from localStorage. If the token is missing, notify the user to log in.
    // Construct the API endpoint using the postId.
    // Use a POST request to send the new comment content to the server. Ensure the content is properly formatted in JSON.
    // If the API call is successful, add the new comment to the comments state.
    // Clear the input field after successfully adding the comment.
    // Handle any errors gracefully, displaying user-friendly error messages.
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true while adding a comment
    try {
      //grab the  userID & token from local storage
      const { token, id } = JSON.parse(localStorage.getItem("auth_user"));
      //check if the token exists
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }
      //construct the API URL for adding a comment
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      //check if the response is ok before clearing input field
      if (!response.ok) {
        throw new Error("Failed to add comment.");
      }

      const data = await response.json();

      setComments((prevComments) => [
        ...prevComments,
        {
          _id: data.comment._id,
          content: data.comment.content,
          author: id,
          createdAt: data.comment.createdAt,
          post: data.comment.post,
        },
      ]); //add the new comment to the comments state

      //clear the input field after successfully adding the comment
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message || "An error occurred while adding the comment.");
    } finally {
      setLoading(false); // Set loading state to false after adding a comment
    }
  };

  // Function to handle editing an existing comment
  const handleEditComment = (comment) => {
    // Set the comment to be edited in the state.  This will trigger the edit mode in the component
    setEditComment(comment);
    // Populate the input field with the content of the comment to be edited.
    setNewComment(comment.content);
  };

  // Function to handle updating an existing comment
  const handleUpdateComment = async (e) => {
    // TODO
    // Retrieve the authentication token from localStorage. If the token is missing, alert the user.
    // Use the editComment state to get the comment's ID and construct the API URL for the specific comment.
    // Send a PUT request to the API with the updated comment content in the body.
    // If successful, update the corresponding comment in the comments state to reflect the changes.
    // Clear the edit mode by resetting the editComment and newComment states.
    // Ensure error handling is robust, with clear messages for the user in case of failure.
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true while updating the comment
    try {
      //Get the token and user ID from local storage
      const { token, id } = JSON.parse(localStorage.getItem("auth_user"));

      //check if the token exists
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }
      //check if user id is the same as the author of the comment
      if (id !== editComment.author) {
        alert("You are not authorized to update this comment.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments/${
          editComment._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      //check if the response is ok before updating the comment
      if (!response.ok) {
        throw new Error("Failed to update comment.");
      }

      const data = await response.json();

      //If successful, update the corresponding comment in the comments state to reflect the changes
      setComments((prevComments) => [
        ...prevComments,
        {
          _id: data.comment._id,
          content: data.comment.content,
          author: id,
          createdAt: data.comment.createdAt,
          post: data.comment.post,
        },
      ]);
      setEditComment(null); // Clear edit mode
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error updating comment:", error);
      alert(error.message || "An error occurred while updating the comment.");
    } finally {
      setLoading(false); // Set loading state to false after updating the comment
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async (commentId, commentAuthorId) => {
    // TODO
    // Access the authentication token and current user ID from localStorage.
    // Ensure that the user is authorized to delete the comment (e.g., they are the author or the post owner).
    // Use the comment's ID to construct the API URL.
    // Send a DELETE request to the API with the token in the Authorization header.
    // If successful, remove the deleted comment from the comments state to update the UI.
    // Handle any errors, providing meaningful feedback to the user.
    try {
      // Get the token and user ID from localStorage
      const { token, id } = JSON.parse(localStorage.getItem("auth_user"));

      // Check if the token exists
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      // Check if the user is authorized to delete the comment
      if (id !== commentAuthorId) {
        alert("You are not authorized to delete this comment.");
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is ok before removing the comment
      if (!response.ok) {
        throw new Error("Failed to delete comment.");
      }

      // Remove the deleted comment from the comments state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message || "An error occurred while deleting the comment.");
    }
  };

  // Function to toggle the visibility of the comments section
  const toggleShowComments = () => {
    //sets the hideComment state to the opposite of its current value. This is a common way to toggle a boolean value.
    setHideComment(!hideComment);
  };

  // Function to render the comments section. This function takes the comments data from the component's state, sorts them according to the selected sort option, and then maps each comment to a JSX element for display.
  const renderComments = () => {
    // Create a copy of the comments array using the spread operator to avoid modifying the original state directly.  This is because sort mutates the original array
    const sortedComments = [...comments].sort((a, b) => {
      // Sort comments by creation date (newest or oldest)
      if (sortOption === "newest") {
        // Compare the createdAt timestamps of two comments (b - a for descending order - newest first) and converts them to date objects before comparison
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "oldest") {
        //Compare timestamps in ascending order to sort from oldest to newest
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0; // Don't sort if sortOption is not "newest" or "oldest"
    });

    return sortedComments.map(
      (
        comment // Map over the sorted comments array and render each comment
      ) => (
        <div key={comment._id} className={styles.comment}>
          {" "}
          {/* Container for each comment  */}
          <p>{comment.content}</p> {/* Display the comment content */}
          {/* Display the timestamp of when the comment was created in a specific format */}
          <span className={styles.comment__timestamp}>
            {moment(comment.createdAt).format("Do MMM YYYY HH:mm:ss")}
          </span>
          {/* Button to edit the comment */}
          <button onClick={() => handleEditComment(comment)}>Edit</button>
          {/* Button to delete the comment */}
          <button
            onClick={() => handleDeleteComment(comment._id, comment.author)} // Pass comment ID and author ID for authorization
          >
            Delete
          </button>
        </div>
      )
    );
  };

  // Return the JSX to render the comment section component
  return (
    <div className={styles.commentSection}>
      {" "}
      {/* Main container for the comment section */}
      <h3>
        {" "}
        {/* Heading that changes based on whether the user is editing a comment or adding a new one */}
        {editComment ? "Edit your comment" : "Leave a comment"}
      </h3>
      {/* Form for adding or updating a comment */}
      <form onSubmit={editComment ? handleUpdateComment : handleAddComment}>
        {" "}
        {/* Determine which function to call on submit based on editComment state */}
        <div className={styles.textareaContainer}>
          {" "}
          {/* Container for the textarea */}
          <textarea
            value={newComment} // Bind the value to the newComment state
            onChange={(e) => setNewComment(e.target.value)} // Update newComment state when input changes
            placeholder={
              // Dynamic placeholder text
              editComment ? "Update your comment..." : "Write a comment..."
            }
            className={styles.commentForm__input}
            rows="3" //Set the number of rows for the textarea
            disabled={loading} //Disable textarea while loading
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || loading} // Disable if comment is empty or loading
          className={styles.commentForm__submit}
        >
          {/* Dynamic button text based on loading and edit state */}
          {loading
            ? "Processing..." // Display loading text while submitting
            : editComment
            ? "Update Comment"
            : "Comment"}
        </button>
        {/* Cancel button for editing a comment */}
        {editComment && ( // Conditionally render the Cancel button only in edit mode
          <button
            type="button" //important to set to button so that the form isn't submitted
            onClick={() => {
              // Clear edit state and reset input field when clicked
              setEditComment(null);
              setNewComment("");
            }}
            className={styles.cancelEditBtn}
          >
            Cancel
          </button>
        )}
      </form>
      <div className={styles.sortOptions}>
        {" "}
        {/*Container for comment sorting options*/}
        <label>Sort by: </label> {/*Label for the select dropdown*/}
        <select
          value={sortOption} // Bind selected value to sortOption state
          onChange={(e) => setSortOption(e.target.value)} // Update sortOption on change
        >
          <option value="newest">Newest</option>{" "}
          {/* Option to sort by newest comments */}
          <option value="oldest">Oldest</option>{" "}
          {/* Option to sort by oldest comments */}
        </select>
      </div>
      {/* Button to show/hide comments */}
      <button onClick={toggleShowComments} className={styles.toggleCommentsBtn}>
        {" "}
        {/* Button to toggle comment visibility */}
        {hideComment ? "Show comments" : "Hide comments"}{" "}
        {/* Toggle button text */}
      </button>
      {/* Conditionally render the comments list */}
      {!hideComment && ( // Only render comments if hideComment is false
        <div className={styles.commentsList}>{renderComments()}</div> // Render the comments using the renderComments function
      )}
    </div>
  );
}

// PropTypes for type checking the component's props
CommentSection.propTypes = {
  postId: PropTypes.number.isRequired, // postId is required and must be a number
};

// Export the CommentSection component as the default export
export default CommentSection;
