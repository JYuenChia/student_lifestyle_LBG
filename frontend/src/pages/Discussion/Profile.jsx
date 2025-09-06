import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/images/return-icon.png';
import profilePicture from '../../assets/images/profile-picture.jpg'; 
import editIcon from '../../assets/images/edit.png'; 
import addIcon from '../../assets/images/add.png';
import heartIcon from '../../assets/images/heart.png';
import heartClickedIcon from '../../assets/images/heart-clicked.png';
import commentIcon from '../../assets/images/comment.png';
import shareIcon from '../../assets/images/share.png';
import bookmarkIcon from '../../assets/images/bookmark.png';
import bookmarkClickedIcon from '../../assets/images/bookmark-clicked.png';
import { usePosts } from '../../context/PostsContext';

export default function Profile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Posts');
  const { posts, likePost, bookmarkPost, addComment, getTotalStats } = usePosts();
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('Bella');
  const [bio, setBio] = useState('Wake up and live');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedMood, setSelectedMood] = useState('None');
  const [isMoodDropdownOpen, setIsMoodDropdownOpen] = useState(false);
  const [isCommunitiesDropdownOpen, setIsCommunitiesDropdownOpen] = useState(false);
  
  // Mood options
  const moodOptions = ['None', 'Happy', 'Sad', 'Angry', 'Excited', 'Tired', 'Stressed', 'Neutral'];
  
  // Mock communities data
  const joinedCommunities = [
    'Study Group',
    'Fitness Enthusiasts',
    'Book Club',
    'Tech Discussions',
    'Music Lovers'
  ];

  // Stats font size preset - change this value to adjust all stats at once
  const statsFontSize = {
    number: '15px',    // Font size for numbers 
    label: '12px'      // Font size for labels 
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUsername = formData.get('username');
    const newBio = formData.get('bio');
    
    setUsername(newUsername);
    setBio(newBio);
    setIsDialogOpen(false);
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
      addComment(activeCommentPost, newComment);
      setNewComment('');
    }
  };

  // Get updated stats
  const { totalPosts, totalLikes } = getTotalStats();

  // Check if bio has more than 3 lines
  const bioLines = bio.split('\n');
  const hasMoreThan3Lines = bioLines.length > 3;
  const displayBio = showFullBio ? bio : bioLines.slice(0, 3).join('\n');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Return button at top left */}
      <div style={{ position: 'absolute', top: '15px', left: '5px', zIndex: 30 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={returnIcon} alt="Return" style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Edit Profile button at top right */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 30 }}>
        <button
          onClick={() => setIsDialogOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Edit profile"
        >
          <img src={editIcon} alt="Edit" style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Main content area */}
      <div style={{ 
        padding: '60px 20px 20px',
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 60px)'
      }}>
        {/* Profile Header */}
        <div style={{ marginBottom: '30px' }}>
          {/* Profile Photo and Info Container */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '20px',
            gap: '20px'
          }}>
            {/* Round Profile Photo */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}
            className="font-sans text-5xl font-bold">
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Username only */}
            <div style={{ flex: 1, paddingTop: '10px' }}>
              {/* Username */}
              <h1 className="font-sans text-3xl font-bold text-gray-800" style={{
                margin: '0',
                lineHeight: '1.5',
                fontSize: '25px'
              }}>
                {username}
              </h1>
              
              {/* Today's Mood Menu */}
              <div style={{ marginTop: '5px', position: 'relative' }}>
                <button
                  onClick={() => setIsMoodDropdownOpen(!isMoodDropdownOpen)}
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
                    marginBottom: '8px',
                    width: '100%',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Today's Mood: {selectedMood}</span>
                  <span style={{ fontSize: '11px' }}>▼</span>
                </button>
                
                {/* Mood Dropdown */}
                {isMoodDropdownOpen && (
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
                    {moodOptions.map(mood => (
                      <button
                        key={mood}
                        onClick={() => {
                          setSelectedMood(mood);
                          setIsMoodDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          backgroundColor: selectedMood === mood ? '#f0f0f0' : 'transparent',
                          textAlign: 'left',
                          fontSize: '11px',
                          color: '#333',
                          cursor: 'pointer',
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedMood === mood ? '#f0f0f0' : 'transparent'}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Communities Joined Menu */}
              <div style={{ position: 'relative' }}>
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
                  <span>Communities Joined ({joinedCommunities.length})</span>
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>
                
                {/* Communities Dropdown */}
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
                    {joinedCommunities.map((community, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '10px 12px',
                          borderBottom: index < joinedCommunities.length - 1 ? '1px solid #f0f0f0' : 'none',
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

          {/* Bio Section - moved below profile picture, left aligned */}
          <div style={{
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div className="font-sans text-sm text-gray-600" style={{
              margin: '0',
              lineHeight: '1.4',
              fontSize: '12px',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              wordWrap: 'break-word',
              maxWidth: '100%'
            }}>
              {displayBio}
              {hasMoreThan3Lines && !showFullBio && (
                <button
                  onClick={() => setShowFullBio(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '0',
                    marginLeft: '8px',
                    textDecoration: 'underline'
                  }}
                >
                  view more
                </button>
              )}
              {showFullBio && hasMoreThan3Lines && (
                <button
                  onClick={() => setShowFullBio(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '0',
                    marginLeft: '8px',
                    textDecoration: 'underline'
                  }}
                >
                  view less
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '18px',
            padding: '0 4px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans font-bold text-gray-800" style={{
                fontSize: statsFontSize.number,
                marginBottom: '4px'
              }}>
                {totalPosts}
              </div>
              <div className="font-sans text-gray-600" style={{
                fontSize: statsFontSize.label
              }}>
                posts
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans font-bold text-gray-800" style={{
                fontSize: statsFontSize.number,
                marginBottom: '4px'
              }}>
                {totalLikes}
              </div>
              <div className="font-sans text-gray-600" style={{
                fontSize: statsFontSize.label
              }}>
                likes
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans font-bold text-gray-800" style={{
                fontSize: statsFontSize.number,
                marginBottom: '4px'
              }}>
                0
              </div>
              <div className="font-sans text-gray-600" style={{
                fontSize: statsFontSize.label
              }}>
                followers
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans font-bold text-gray-800" style={{
                fontSize: statsFontSize.number,
                marginBottom: '4px'
              }}>
                37
              </div>
              <div className="font-sans text-gray-600" style={{
                fontSize: statsFontSize.label
              }}>
                following
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eee'
          }}>
            {['Posts', 'Favourites'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className="font-sans font-semibold"
                style={{
                  flex: 1,
                  padding: '15px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  color: selectedTab === tab ? '#333' : '#999',
                  borderBottom: selectedTab === tab ? '2px solid #333' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 0' }}>
          {selectedTab === 'Posts' ? (
            <div>
              {posts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999'
                }}>
                  <p>No posts yet</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} style={{
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
                        color: '#666',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={profilePicture}
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
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

                    {/* Post content */}
                    <div className="font-sans leading-relaxed text-gray-800" style={{ 
                      fontSize: '12px',
                      marginBottom: '16px'
                    }}>
                      {post.content}
                    </div>

                    {/* Post actions */}
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
                ))
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999'
            }}>
              <p>No favourites yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '26px',
            width: '75%',
            maxWidth: '400px',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#333'
            }}>
              Edit Profile
            </h2>
            
            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  color: '#555'
                }}>
                  Username
                </label>
                <input
                  name="username"
                  defaultValue={username}
                  maxLength={12}
                  style={{
                    width: '93%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  color: '#555'
                }}>
                  Bio
                </label>
                <textarea
                  name="bio"
                  defaultValue={bio}
                  rows={4}
                  style={{
                    width: '94%',
                    padding: '8px 10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }}
                  onInput={e => {
                    let value = e.target.value.replace(/\r\n/g, '\n'); // Normalize line breaks
                    let lines = value.split('\n');
                    let newLines = [];
                    lines.forEach(line => {
                      while (line.length > 55) {
                        newLines.push(line.slice(0, 55));
                        line = line.slice(55);
                      }
                      newLines.push(line);
                    });
                    // Limit to 8 lines
                    if (newLines.length > 8) newLines = newLines.slice(0, 8);
                    e.target.value = newLines.join('\n');
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#666',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#333',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Add Post Button */}
      <div style={{ 
        position: 'fixed', 
        bottom: '90px', 
        right: '20px', 
        zIndex: 40 
      }}>
        <button
          onClick={() => navigate('/NewPost')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          aria-label="Create new post"
        >
          <img src={addIcon} alt="Add" style={{ width: '32px', height: '32px', filter: 'brightness(0)' }} />
        </button>
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