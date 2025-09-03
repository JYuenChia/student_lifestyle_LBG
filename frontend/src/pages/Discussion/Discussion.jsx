import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/images/search-icon.png';
import profileIcon from '../../assets/images/profile-icon.png';
import heartIcon from '../../assets/images/heart.png';
import heartClickedIcon from '../../assets/images/heart-clicked.png';
import commentIcon from '../../assets/images/comment.png';
import shareIcon from '../../assets/images/share.png';
import bookmarkIcon from '../../assets/images/bookmark.png';
import bookmarkClickedIcon from '../../assets/images/bookmark-clicked.png';
import mockPosts from '../../data/mockPosts.json';
import mockCommunities from '../../data/mockCommunities.json';

// Dynamic image loading with Vite
const images = import.meta.glob('../../assets/images/*.{jpg,jpeg,png,gif}', { eager: true });

export default function Discussion() {
  const [selectedTab, setSelectedTab] = useState('Discussion');
  const [posts, setPosts] = useState(mockPosts.map(post => ({ ...post, isBookmarked: false })));
  const [newComment, setNewComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [myCommunities] = useState(mockCommunities.myCommunities);
  const [recommendedCommunities] = useState(mockCommunities.recommendedCommunities);
  const navigate = useNavigate();

  // Helper function to get the correct image source
  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove leading ../../ if present and get just the filename
    const cleanPath = imagePath.replace(/^(\.\.\/)+/, '').replace(/^assets\/images\//, '');
    
    // Find the image in the glob
    for (const key in images) {
      if (key.includes(cleanPath)) {
        return images[key].default || images[key];
      }
    }
    return null;
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleAddComment = (postId, commentText) => {
    if (commentText.trim()) {
      setPosts(posts.map(post => 
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
      ));
      setNewComment('');
    }
  };

  const openCommentDrawer = (postId) => {
    setActiveCommentPost(postId);
  };

  const closeCommentDrawer = () => {
    setActiveCommentPost(null);
    setNewComment('');
  };

  const submitComment = () => {
    if (newComment.trim() && activeCommentPost) {
      handleAddComment(activeCommentPost, newComment);
    }
  };

  const PostCard = ({ post }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '5px',
      padding: '16px',
      marginBottom: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0',
    }}>
      {/* User header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          marginRight: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#666'
        }}>
          {post.user.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
            <div
              className="font-sans font-semibold"
              style={{
                fontSize: '14px',
                color: '#333',
                fontWeight: 600,
                marginBottom: '2px'
              }}
            >
              {post.user}
            </div>
            <div
              className="font-sans"
              style={{
                fontSize: '10px',
                color: '#888',
                marginTop: '2px'
              }}
            >
              {post.time}
            </div>
          </div>
        <button 
          onClick={() => handleBookmark(post.id)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s'
          }}
        >
          <img 
            src={post.isBookmarked ? bookmarkClickedIcon : bookmarkIcon}
            alt="Bookmark" 
            style={{ 
              width: '20px', 
              height: '20px',
              filter: post.isBookmarked ? 'brightness(0) saturate(100%) invert(20%) sepia(99%) saturate(10000%) hue-rotate(230deg) brightness(80%) contrast(300%)' : 'none'
            }} 
          />
        </button>
      </div>

      {/* Post content */}
      <div className="font-sans leading-relaxed text-gray-800" style={{ 
        fontSize: '12px',
        marginBottom: post.image ? '12px' : '16px' 
      }}>
        {post.content}
      </div>

      {/* Post image if exists */}
      {post.image && (
        <div style={{
          width: '100%',
          borderRadius: '8px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          <img 
            src={getImageSrc(post.image)}
            alt="Post"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            [Image not found]
          </div>
        </div>
      )}

      {/* Post actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => handleLike(post.id)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '20px',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s'
          }}
        >
          <img 
            src={post.isLiked ? heartClickedIcon : heartIcon}
            alt="Like"
            style={{
              width: '18px',
              height: '18px',
              filter: post.isLiked ? 'invert(32%) sepia(98%) saturate(7492%) hue-rotate(-7deg) brightness(97%) contrast(104%)' : 'none'
            }}
          />
          <span className="font-sans text-sm" style={{ 
            color: post.isLiked ? '#ff4757' : '#666' 
          }}>
            {post.likes}
          </span>
        </button>

        <button 
          onClick={() => openCommentDrawer(post.id)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '20px',
            transition: 'background-color 0.2s'
          }}
          onMouseDown={(e) => e.target.closest('button').style.backgroundColor = 'rgba(0, 123, 255, 0.1)'}
          onMouseUp={(e) => e.target.closest('button').style.backgroundColor = 'transparent'}
          onMouseLeave={(e) => e.target.closest('button').style.backgroundColor = 'transparent'}
        >
          <img 
            src={commentIcon} 
            alt="Comment" 
            style={{ width: '18px', height: '18px' }} 
          />
          <span className="font-sans text-sm text-gray-600">{post.comments}</span>
        </button>

        <button style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginLeft: 'auto',
          padding: '8px',
          borderRadius: '20px',
          transition: 'background-color 0.2s'
        }}
        onMouseDown={(e) => e.target.closest('button').style.backgroundColor = 'rgba(0, 200, 83, 0.1)'}
        onMouseUp={(e) => e.target.closest('button').style.backgroundColor = 'transparent'}
        onMouseLeave={(e) => e.target.closest('button').style.backgroundColor = 'transparent'}
        >
          <img 
            src={shareIcon} 
            alt="Share" 
            style={{ width: '18px', height: '18px' }} 
          />
        </button>
      </div>
    </div>
  );

  const CommunityCard = ({ community, showJoinButton = false }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0'
    }}>
      {/* Community Image/Icon */}
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        backgroundColor: '#f5f6f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        marginRight: '12px'
      }}>
        {community.image}
      </div>

      {/* Community Info */}
      <div style={{ flex: 1 }}>
        <div className="font-sans font-semibold" style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '2px'
        }}>
          {community.name}
        </div>
        <div className="font-sans" style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '2px'
        }}>
          {community.description}
        </div>
        <div className="font-sans" style={{
          fontSize: '11px',
          color: '#999'
        }}>
          {community.members}
        </div>
      </div>

      {/* Join Button for Recommended */}
      {showJoinButton && (
        <button style={{
          padding: '6px 16px',
          backgroundColor: '#38b6ff',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          + Join
        </button>
      )}

      {/* View Group for My Communities */}
      {!showJoinButton && (
        <button className="font-sans" style={{
          padding: '6px 12px',
          backgroundColor: 'transparent',
          color: '#38b6ff',
          border: '1px solid #38b6ff',
          borderRadius: '16px',
          fontSize: '12px',
          cursor: 'pointer'
        }}>
          View group
        </button>
      )}
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top right icon buttons */}
      <div style={{ position: 'absolute', top: '12px', right: '1px', display: 'flex', gap: '1px', zIndex: 30 }}>
        <button style={{ 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}>
          <img src={searchIcon} alt="Search" style={{ width: '24px', height: '24px' }} />
        </button>
        <button 
          onClick={() => navigate('/profile')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <img src={profileIcon} alt="Profile" style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Button group in subheader area */}
      <div
        style={{
          position: 'relative',
          left: '50%',
          top: '55px',
          width: '340px',
          height: '35px',
          backgroundColor: '#f5f6f7',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transform: 'translateX(-50%)',
          gap: '30px',
          padding: '4px',
        }}
      >
        {['Discussion', 'Community'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className="font-sans"
            style={{
              border: 'none',
              background: selectedTab === tab ? '#38b6ff' : 'transparent',
              color: selectedTab === tab ? '#fff' : '#939598',
              fontSize: '13px',
              borderRadius: selectedTab === tab ? '20px' : '14px', 
              padding: selectedTab === tab ? '6px 18px' : '6px 10px', 
              boxShadow: selectedTab === tab ? '0 2px 8px rgba(56,182,255,0.18)' : 'none',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', 
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ 
        padding: '20px', 
        paddingTop: '80px',
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}>
        {selectedTab === 'Discussion' ? (
          <div>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '0',
            backgroundColor: 'white',
            minHeight: 'calc(100vh - 140px)'
          }}>
            {/* My Communities Section */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 className="font-sans font-bold" style={{
                  fontSize: '18px',
                  color: '#333',
                  margin: 0
                }}>
                  My Communities
                </h2>
                <button style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  +
                </button>
              </div>

              {/* My Communities List */}
              <div>
                {myCommunities.map(community => (
                  <CommunityCard 
                    key={community.id} 
                    community={community} 
                    showJoinButton={false}
                  />
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 className="font-sans font-bold" style={{
                  fontSize: '18px',
                  color: '#333',
                  margin: 0
                }}>
                  Recommended
                </h2>
                <button className="font-sans" style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#38b6ff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  View all
                </button>
              </div>

              {/* Recommended Communities List */}
              <div>
                {recommendedCommunities.map(community => (
                  <CommunityCard 
                    key={community.id} 
                    community={community} 
                    showJoinButton={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Simple Comment Drawer */}
      {activeCommentPost && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={closeCommentDrawer}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '70vh',
              padding: '20px',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease-out',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <h3 className="font-sans text-lg font-semibold" style={{ margin: 0 }}>
                Comments
              </h3>
              <button 
                onClick={closeCommentDrawer}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            </div>

            {/* Comments List */}
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {(() => {
                const currentPost = posts.find(p => p.id === activeCommentPost);
                return currentPost && currentPost.commentsList && currentPost.commentsList.length > 0 ? (
                  currentPost.commentsList.map((comment, index) => (
                    <div key={comment.id || index} style={{
                      padding: '12px 0',
                      borderBottom: index < currentPost.commentsList.length - 1 ? '1px solid #eee' : 'none',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '6px' 
                      }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: '#ddd',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#666'
                        }}>
                          {comment.user.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="font-sans font-semibold text-sm text-gray-800">
                              {comment.user}
                            </span>
                            <span
                              className="font-sans text-[10px] text-gray-500"
                              style={{ marginLeft: '10px', opacity: 0.8 }}
                            >
                              {comment.time}
                            </span>
                          </div>
                      </div>
                      <div className="font-sans text-sm text-gray-700 ml-10">
                        {comment.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#999', 
                    padding: '40px 20px' 
                  }}>
                    No comments yet. Be the first to comment!
                  </div>
                );
              })()}
            </div>

            {/* Comment Input */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid #eee'
            }}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="font-sans"
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitComment();
                  }
                }}
              />
              <button
                onClick={submitComment}
                disabled={!newComment.trim()}
                className="font-sans font-medium"
                style={{
                  padding: '12px 20px',
                  backgroundColor: newComment.trim() ? '#38b6ff' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}