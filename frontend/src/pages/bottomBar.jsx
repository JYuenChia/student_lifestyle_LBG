import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomBar() {
  const [selected, setSelected] = useState('home');
  const navigate = useNavigate();

  const icons = [
    { name: 'chat', src: '/chat.png', alt: 'Chat', to: '/chat' },
    { name: 'community', src: '/community.png', alt: 'Community', to: '/discussion' },
    { name: 'home', src: '/home.png', alt: 'Home', to: '/' },
    { name: 'goal', src: '/goal.png', alt: 'Goal', to: '/todo' },
    { name: 'settings', src: '/settings.png', alt: 'Settings', to: '/settings' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '84.6px',
        backgroundColor: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {icons.map(icon => (
        <button
          key={icon.name}
          onClick={() => {
            setSelected(icon.name);
            navigate(icon.to);
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <img
            src={icon.src}
            alt={icon.alt}
            style={{
              width: 50,
              height: 50,
              filter: selected === icon.name ? 'grayscale(0%) brightness(0) sepia(1) hue-rotate(180deg) saturate(0) opacity(1)' : 'grayscale(100%)',
              transition: 'filter 0.2s',
            }}
          />
        </button>
      ))}
    </div>
  );
}