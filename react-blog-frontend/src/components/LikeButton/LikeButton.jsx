import { useState, useEffect } from "react"; // Import necessary React hooks
import PropTypes from "prop-types"; // Import PropTypes for prop type validation
import { FaHeart } from "react-icons/fa"; // Import the heart icon from react-icons
import styles from "./LikeButton.module.css"; // Import CSS styles for the component

// LikeButton component definition
function LikeButton({ postId, isDarkMode }) {
  //postId: The ID of the post, isDarkMode: Boolean indicating if dark mode is enabled
  // Initialize state variables using useState hook
  const [likes, setLikes] = useState(0); // State for tracking the number of likes for the post, initially 0
  const [isLiked, setIsLiked] = useState(false); // State for tracking whether the current user has liked the post, initially false

  // useEffect hook to fetch the initial like status and count when the component mounts or when the postId changes
  useEffect(() => {
    // Define an asynchronous function to fetch the likes for a post.  Asynchronous functions allow you to use the await keyword to pause execution until a promise resolves
    const fetchLikes = async () => {
      setIsLiked(false);
      setLikes(0);
      // TODO
      // Update the Function:
      // Update the function fetchLikes within the useEffect hook.
      // Access Authentication Token:
      // Retrieve the auth_user object from localStorage and parse it.
      // Extract the token. If the token is missing, alert the user and stop execution.
      // Fetch Likes from the API:
      // Use the fetch API to send a GET request to the endpoint:
      // ${import.meta.env.VITE_API_URL}/api/likes/${postId}.
      // Include the Authorization header with the token for user authentication.
      // Handle API Response:
      // Check if the response is successful (response.ok).
      // Parse the response as JSON to extract the likes data.
      // Update State:
      // Use the length of the likes data array to update the likes state.
      // Determine if the current user has liked the post by checking if their user ID exists in the likes data. Update the isLiked state accordingly.
      // Handle Errors:
      // Use a try...catch block to catch and log any errors. Alert the user in case of an error.

      try {
        const { token, id } = JSON.parse(localStorage.getItem("auth_user")); //Retrieve the auth_user object from localStorage and parse it
        if (!token) {
          alert("User not authenticated. Please log in."); //Alert the user if the token is missing
          return;
        }

        // Fetch likes for the post
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/posts/${postId}/likes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch likes."); //Throw an error if the response is not successful
        }

        const data = await response.json(); //Parse the response as JSON

        setLikes(data.length); //Update the likes state with the length of the data array

        // Check if the current user has liked the post
        const userLiked = data.some((like) => like.user === id); //Check if the user ID exists in the likes data
        setIsLiked(userLiked); //Update the isLiked state based on the result
      } catch (error) {
        console.error("Error fetching likes:", error); //Log the error to the console
        alert("Failed to fetch likes. Please try again."); //Alert the user in case of an error
      }
    };

    fetchLikes(); //Call the fetchLikes function to execute
  }, [postId]); // Run this effect whenever the postId changes

  const handleLikeClick = async () => {
    // Update the Function:
    // Update the function handleLikeClick.
    // Access Authentication Token:
    // Retrieve the auth_user object from localStorage and parse it.
    // Extract the token. If the token is missing, alert the user and stop execution.
    // Determine HTTP Method:
    // Use POST if the user has not liked the post yet.
    // Use DELETE if the user is undoing a like.
    // Construct API URL:
    // Use the endpoint: ${import.meta.env.VITE_API_URL}/api/likes/${postId}.
    // Send API Request:
    // Use the fetch API to send the request.
    // Include the Authorization header with the token for user authentication.
    // Check if the response is successful. If not, parse the error response and throw an error with a meaningful message.
    // Update Like Count:
    // Fetch the updated like count by calling the same API endpoint as in fetchLikes.
    // Update the likes and isLiked states based on the response.
    // Handle Errors:
    // Use a try...catch block to log and alert the user in case of an error.
    try {
      const { token, id } = JSON.parse(localStorage.getItem("auth_user")); //Retrieve the auth_user object from localStorage and parse it
      if (!token) {
        alert("User not authenticated. Please log in."); //Alert the user if the token is missing
        return;
      }

      const URL = `${import.meta.env.VITE_API_URL}/api/posts/${postId}/likes`; //Construct the API URL

      if (isLiked) {
        // Unlike the post
        const response = await fetch(URL, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json(); //Parse the error response
          throw new Error(errorData.message); //Throw an error with the error message
        }
        setIsLiked(false); //Update the isLiked state to false
      } else {
        // Like the post
        const response = await fetch(URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json(); //Parse the error response
          throw new Error(errorData.message); //Throw an error with the error message
        }
        setIsLiked(true); //Update the isLiked state to
      }

      // Fetch updated like count
      const likesResponse = await fetch(URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!likesResponse.ok) {
        throw new Error("Failed to fetch likes."); //Throw an error if the response is not successful
      }
      const data = await likesResponse.json(); //Parse the response as JSON
      setLikes(data.length); //Update the likes state with the length of the data array
    } catch (error) {
      console.error("Error updating like:", error); //Log the error to the console
      alert("Failed to update like. Please try again."); //Alert the user in case of
    }
  };

  return (
    //Return JSX for the like button
    <button
      className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`} //Apply "liked" class if post is liked
      onClick={handleLikeClick} //Call handleLikeClick when button is clicked
      aria-label={isLiked ? "Unlike post" : "Like post"} //Set aria-label for accessibility
    >
      {/* Container for the heart icon, applying dark mode styles if enabled */}
      <div
        className={`${styles.iconContainer} ${
          isDarkMode ? styles.darkIconContainer : ""
        }`}
      >
        {/* Heart icon with dynamic styles based on like status and dark mode */}
        <FaHeart
          className={`${styles.likeIcon} ${
            isLiked ? styles.likedIcon : styles.unlikedIcon //Apply liked/unliked styles
          } ${isDarkMode && !isLiked ? styles.darkUnlikedIcon : ""}`} //Apply dark mode style if not liked and in dark mode
        />
      </div>
      {/* Display the number of likes with dynamic styles for dark mode */}
      <span
        className={`${styles.likeCount} ${
          isDarkMode ? styles.darkLikeCount : "" //Apply dark mode styles
        }`}
      >
        {likes} {/* Display the like count */}
      </span>
    </button>
  );
}

// PropTypes for type checking the component's props
LikeButton.propTypes = {
  postId: PropTypes.number.isRequired, //postId is required and must be a number
  isDarkMode: PropTypes.bool.isRequired, //isDarkMode is required and must be a boolean
};

export default LikeButton; //Export the LikeButton component
