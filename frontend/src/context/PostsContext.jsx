import { createContext, useContext, useState } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    const newPost = {
      id: Date.now(), // Simple ID generation
      content: post.content,
      user: 'Bella',
      time: 'now',
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: 0,
      commentsList: []
    };
    setPosts(prevPosts => [newPost, ...prevPosts]); // Add new posts at the beginning
  };

  const likePost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
  };

  const bookmarkPost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const addComment = (postId, commentText) => {
    if (commentText.trim()) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                commentsList: [...(post.commentsList || []), {
                  id: Date.now(),
                  user: 'You',
                  text: commentText.trim(),
                  time: 'now'
                }],
                comments: post.comments + 1
              }
            : post
        )
      );
    }
  };

  // Calculate total stats
  const getTotalStats = () => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    return { totalPosts, totalLikes };
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      setPosts, 
      addPost, 
      likePost,
      bookmarkPost,
      addComment,
      getTotalStats
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
