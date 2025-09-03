import { useState } from 'react';
import BottomBar from './bottomBar';

export default function Discussion() {
  const [selectedTab, setSelectedTab] = useState('Discussion');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top bar area - space for future buttons */}
      <div style={{ height: '60px', backgroundColor: '#f8f9fa' }}>
        {/* Space for future top buttons */}
      </div>

      {/* Button group in subheader area */}
      <div
        style={{
          position: 'relative',
          left: '50%',
          top: '20px',
          width: '280px',
          height: '46.7px',
          backgroundColor: '#f5f6f7',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 22,
          transform: 'translateX(-50%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gap: '8px',
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
              borderRadius: '14px',
              padding: '8px 18px',
              boxShadow: selectedTab === tab ? '0 2px 8px rgba(56,182,255,0.18)' : 'none',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flex: 1,
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