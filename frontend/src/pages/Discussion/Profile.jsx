import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from '../../assets/images/return-icon.png';

export default function Profile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Posts');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Return button at top left */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 30 }}>
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

      {/* Edit button at top right */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 30 }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#666',
          padding: '8px'
        }}
        className="font-sans text-lg">
          ✏️
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
              B
            </div>

            {/* Username and Bio to the right */}
            <div style={{ flex: 1, paddingTop: '10px' }}>
              {/* Username */}
              <h1 className="font-sans text-3xl font-bold text-gray-800" style={{
                margin: '0 0 8px 0'
              }}>
                Bella
              </h1>

              {/* BIO Section */}
                <div className="font-sans text-sm text-gray-600" style={{
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  INFP
                  <br />
                  Wake up and live. 💖
            </div>
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
                123
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
                15
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
    </div>
  );
}