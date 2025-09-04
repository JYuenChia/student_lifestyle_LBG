import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/images/return-icon.png';
import profilePicture from '../../assets/images/profile-picture.jpg'; 
import editIcon from '../../assets/images/edit.png'; 

export default function Profile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Posts');
  const [username, setUsername] = useState('Bella');
  const [bio, setBio] = useState('........................................................................................................................................................................');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUsername = formData.get('username');
    const newBio = formData.get('bio');
    
    setUsername(newUsername);
    setBio(newBio);
    setIsDialogOpen(false);
  };

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

            {/* Username only (removed bio from here) */}
            <div style={{ flex: 1, paddingTop: '10px' }}>
              {/* Username */}
              <h1 className="font-sans text-3xl font-bold text-gray-800" style={{
                margin: '0',
                lineHeight: '1.5',
                fontSize: '25px'
              }}>
                {username}
              </h1>
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
              fontSize: '14px',
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
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '30px',
            padding: '0 10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans text-xl font-bold text-gray-800" style={{
                marginBottom: '4px'
              }}>
                0
              </div>
              <div className="font-sans text-sm text-gray-600">
                posts
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans text-xl font-bold text-gray-800" style={{
                marginBottom: '4px'
              }}>
                0
              </div>
              <div className="font-sans text-sm text-gray-600">
                likes
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans text-xl font-bold text-gray-800" style={{
                marginBottom: '4px'
              }}>
                0
              </div>
              <div className="font-sans text-sm text-gray-600">
                followers
              </div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#eee', margin: '0 10px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div className="font-sans text-xl font-bold text-gray-800" style={{
                marginBottom: '4px'
              }}>
                37
              </div>
              <div className="font-sans text-sm text-gray-600">
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
                  fontSize: '16px',
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
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999'
            }}>
              <p>No posts yet</p>
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
                  style={{
                    width: '93%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
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
    </div>
  );
}