import { useNavigate } from 'react-router-dom';
import returnIcon from '../assets/images/return-icon.png';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Return button at top left */}
      <div style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 30 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'rgba(0,0,0,0.1)', 
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

      {/* Main content area */}
      <div style={{ 
        padding: '60px 20px 20px',
        backgroundColor: '#f9f9f9',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <h2 style={{ color: 'black', fontSize: '24px' }}>Profile Page</h2>
        <p style={{ color: 'black', fontSize: '16px' }}>User profile content goes here...</p>
      </div>
    </div>
  );
}