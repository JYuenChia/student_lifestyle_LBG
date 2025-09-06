import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';
import { toast } from 'sonner';

// Import icons
import returnIcon from '../../assets/images/return-icon.png';
import heartIcon from '../../assets/images/heart.png';
import heartClickedIcon from '../../assets/images/heart-clicked.png';
import bookmarkIcon from '../../assets/images/bookmark.png';
import bookmarkClickedIcon from '../../assets/images/bookmark-clicked.png';
import commentIcon from '../../assets/images/comment.png';
import shareIcon from '../../assets/images/share.png';

// Mood emoji mapping
const moodEmojis = {
  'None': '',
  'Happy': '😊',
  'Sad': '😢',
  'Angry': '😠',
  'Excited': '🤩',
  'Tired': '😴',
  'Stressed': '😰',
  'Neutral': '😐'
};

// Dynamic image loading with Vite
const images = import.meta.glob('../../assets/images/*.{jpg,jpeg,png,gif}', { eager: true });

export default function User() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [selectedTab, setSelectedTab] = useState('Posts');
  const { posts, likePost, bookmarkPost, addComment } = usePosts();
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isCommunitiesDropdownOpen, setIsCommunitiesDropdownOpen] = useState(false);
  
  // Mock user data - in real app, fetch based on username
  const [userData, setUserData] = useState({
    username: username || 'Unknown User',
    bio: 'Wake up and live',
    mood: 'None',
    joinedCommunities: [
      'Study Group',
      'Fitness Enthusiasts'
    ],
    followers: 0,
    following: 37
  });

  // Stats font size preset
  const statsFontSize = {
    number: '15px',
    label: '12px'
  };

  // Helper function to get the correct image source
  const getImageSrc = (imagePath) => {
    const imageKey = `../../assets/images/${imagePath}`;
    const imageModule = images[imageKey];
    return imageModule ? imageModule.default || imageModule : imagePath;
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
      addComment(activeCommentPost, newComment.trim());
      setNewComment('');
      closeCommentDrawer();
    }
  };

  const handleFollow = () => {
    if (!isFollowing && !isPending) {
      setIsPending(true);
      toast("Follow request sent! Waiting for user to accept.", {
        position: "top-center",
        style: {
          background: "white",
          color: "#333",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          width: "320px",
          textAlign: "center"
        },
        duration: 3000,
      });
    }
  };

  // Get user's posts
  const userPosts = posts.filter(post => post.user === userData.username);
  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  // Check if bio has more than 3 lines
  const bioLines = userData.bio.split('\n');
  const hasMoreThan3Lines = bioLines.length > 3;
  const displayBio = showFullBio ? userData.bio : bioLines.slice(0, 3).join('\n');

  // Hide posts and favourites when not following or pending
  const shouldHideContent = !isFollowing;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsCommunitiesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const PostCard = ({ post }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '5px',
      padding: '16px',
      marginBottom: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0',
    }}>
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
          <div className="font-sans font-semibold" style={{
            fontSize: '14px',
            color: '#333',
            fontWeight: 600,
            marginBottom: '2px'
          }}>
            {post.user}
          </div>
          <div className="font-sans" style={{
            fontSize: '10px',
            color: '#888',
            marginTop: '2px'
          }}>
            {post.time}
          </div>
        </div>
        <button 
          onClick={() => bookmarkPost(post.id)}
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

      <div className="font-sans leading-relaxed text-gray-800" style={{ 
        fontSize: '12px',
        marginBottom: post.image ? '12px' : '16px' 
      }}>
        {post.content}
      </div>

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => likePost(post.id)}
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
        }}>
          <img 
            src={shareIcon} 
            alt="Share" 
            style={{ width: '18px', height: '18px' }} 
          />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <img src={returnIcon} alt="Back" style={{ width: '24px', height: '24px' }} />
        </button>
        
        <h1 className="font-sans font-bold" style={{
          fontSize: '18px',
          color: '#333',
          margin: 0
        }}>
          {userData.username}
        </h1>
        
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Profile Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px 20px',
        borderBottom: '1px solid #eee'
      }}>
        {/* Profile Picture and Username */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{ marginRight: '16px' }}>
            {/* Profile Picture */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundImage: 'url("/study1.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid #f0f0f0'
            }}>
            </div>
          </div>
          
          <div style={{ flex: 1, paddingTop: '10px' }}>
            {/* Username */}
            <h2 className="font-sans font-bold" style={{
              fontSize: '22px',
              color: '#333',
              margin: '0',
              lineHeight: '1.5'
            }}>
              {userData.username}
            </h2>

            {/* Today's Mood Display */}
            <div style={{ marginTop: '5px' }}>
              <div style={{
                background: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '10px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
                marginBottom: '8px',
                width: '87%'
              }}>
                <span>Today's Mood: {userData.mood}</span>
              </div>
            </div>

            {/* Communities Joined Menu */}
            <div 
              className="dropdown-container"
              style={{ position: 'relative' }}>
              <button
                onClick={() => setIsCommunitiesDropdownOpen(!isCommunitiesDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '10px',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <span>Communities Joined ({userData.joinedCommunities.length})</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {/* Communities Dropdown Menu */}
              {isCommunitiesDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 100,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {userData.joinedCommunities.map((community, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 12px',
                        borderBottom: index < userData.joinedCommunities.length - 1 ? '1px solid #f0f0f0' : 'none',
                        fontSize: '10px',
                        color: '#333',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {community}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="font-sans" style={{
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.4',
          marginBottom: '20px'
        }}>
          {displayBio}
          {hasMoreThan3Lines && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38b6ff',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '4px',
                fontSize: '14px'
              }}
            >
              {showFullBio ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="font-sans font-bold" style={{
              fontSize: statsFontSize.number,
              color: '#333'
            }}>
              {shouldHideContent ? '-' : totalPosts}
            </div>
            <div className="font-sans" style={{
              fontSize: statsFontSize.label,
              color: '#666'
            }}>
              posts
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-sans font-bold" style={{
              fontSize: statsFontSize.number,
              color: '#333'
            }}>
              {shouldHideContent ? '-' : totalLikes}
            </div>
            <div className="font-sans" style={{
              fontSize: statsFontSize.label,
              color: '#666'
            }}>
              likes
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-sans font-bold" style={{
              fontSize: statsFontSize.number,
              color: '#333'
            }}>
              {shouldHideContent ? '-' : userData.followers}
            </div>
            <div className="font-sans" style={{
              fontSize: statsFontSize.label,
              color: '#666'
            }}>
              followers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="font-sans font-bold" style={{
              fontSize: statsFontSize.number,
              color: '#333'
            }}>
              {shouldHideContent ? '-' : userData.following}
            </div>
            <div className="font-sans" style={{
              fontSize: statsFontSize.label,
              color: '#666'
            }}>
              following
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={isPending}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isPending ? '#f0f0f0' : (isFollowing ? '#28a745' : '#38b6ff'),
            color: isPending ? '#666' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isPending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isPending ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ccc',
                borderTop: '2px solid #666',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Pending
            </>
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow'
          )}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          {['Posts', 'Favourites'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className="font-sans"
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                border: 'none',
                borderBottom: selectedTab === tab ? '2px solid #38b6ff' : '2px solid transparent',
                color: selectedTab === tab ? '#38b6ff' : '#666',
                fontSize: '16px',
                fontWeight: selectedTab === tab ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: 'calc(100vh - 300px)'
      }}>
        {shouldHideContent ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🔒
            </div>
            <h3 className="font-sans font-semibold" style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '8px'
            }}>
              Private Account
            </h3>
            <p className="font-sans" style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              {isPending 
                ? "Follow request sent! You'll be able to see their posts and favourites once they accept your request."
                : "Follow this user to see their posts and favourites."
              }
            </p>
          </div>
        ) : (
          <>
            {selectedTab === 'Posts' ? (
              userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#666'
                }}>
                  <h3 className="font-sans font-semibold" style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    No posts yet
                  </h3>
                  <p className="font-sans" style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {userData.username} hasn't shared any posts yet.
                  </p>
                </div>
              )
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                <h3 className="font-sans font-semibold" style={{
                  fontSize: '18px',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  No favourites yet
                </h3>
                <p className="font-sans" style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {userData.username} hasn't favourited any posts yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comment Drawer */}
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

            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {(() => {
                const post = posts.find(p => p.id === activeCommentPost);
                if (!post || !post.commentsList || post.commentsList.length === 0) {
                  return (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#666', 
                      fontSize: '14px',
                      padding: '40px 20px'
                    }}>
                      No comments yet. Be the first to comment!
                    </div>
                  );
                }
                return post.commentsList.map((comment, index) => (
                  <div key={index} style={{ 
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div className="font-sans font-medium" style={{ 
                      fontSize: '14px', 
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      {comment.user}
                    </div>
                    <div className="font-sans" style={{ 
                      fontSize: '14px', 
                      color: '#666' 
                    }}>
                      {comment.text}
                    </div>
                  </div>
                ));
              })()}
            </div>

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
                  if (e.key === 'Enter' && newComment.trim()) {
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

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
