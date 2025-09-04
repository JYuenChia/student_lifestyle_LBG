import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profilePicture from '../../assets/images/profile-picture.jpg';
import { usePosts } from '../../context/PostsContext';

export default function NewPost() {
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const { addPost } = usePosts();

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePost = () => {
    if (postContent.trim()) {
      addPost({ content: postContent });
      navigate(-1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff, #d1e0f4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Modal Container */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Header */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#5DADE2',
          textAlign: 'center',
          marginBottom: '24px',
          margin: '0 0 24px 0'
        }}>
          New Post
        </h2>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
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
          <span style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#333'
          }}>
            Bella
          </span>
        </div>

        {/* Post Input */}
        <div style={{ marginBottom: '20px' }}>
          <textarea
            placeholder="Type here..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Inter, system-ui, sans-serif',
              resize: 'none',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Action Icons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          paddingLeft: '8px'
        }}>
          {/* Photo Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </button>

          {/* Camera Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>

          {/* Chat Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          {/* Location Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>

          {/* Lock Icon */}
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#5DADE2',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            style={{
              flex: 1,
              padding: '12px 24px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#5DADE2',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Post ▶
          </button>
        </div>
      </div>
    </div>
  );
}
