import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from './bottomBar';
import searchIcon from '../assets/images/search-icon.png';
import profileIcon from '../assets/images/profile-icon.png';

export default function Discussion() {
  const [selectedTab, setSelectedTab] = useState('Discussion');
  const navigate = useNavigate();

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
            style={{
              border: 'none',
              background: selectedTab === tab ? '#38b6ff' : 'transparent',
              color: selectedTab === tab ? '#fff' : '#939598',
              fontSize: '13px',
              fontFamily: "'Canva Sans', sans-serif",
              borderRadius: selectedTab === tab ? '20px' : '14px', 
              padding: selectedTab === tab ? '6px 18px' : '6px 10px', 
              boxShadow: selectedTab === tab ? '0 2px 8px rgba(56,182,255,0.18)' : 'none',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent', // ← add this
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ padding: '80px 20px 20px' }}>
        <h2>Discussion Page</h2>
        <p>Selected tab: {selectedTab}</p>
      </div>

      <BottomBar />
    </div>
  );
}