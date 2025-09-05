import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Generate non-overlapping polka dots
function PolkaDots() {
  const dots = [];
  while (dots.length < 28) {
    const size = 20 + Math.random() * 24;
    const top = Math.random() * (100 - size / 4);
    const left = Math.random() * (100 - size / 4);
    // Check overlap
    if (
      dots.every(
        d =>
          Math.abs(d.top - top) > (d.size + size) / 2.2 &&
          Math.abs(d.left - left) > (d.size + size) / 2.2
      )
    ) {
      dots.push({ top, left, size });
    }
  }
  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            background: '#c3d5e2',
            opacity: 0.9,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

// Straight line with projectile drop to the right
function ProjectileTop() {
  return (
    <svg viewBox="0 0 400 60" width="100%" height="60" style={{ display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 3 }}>
      <path
        d="M0,0 H320 Q400,0 380,60 Q370,60 0,60 Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#38b6ff',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }}>
      <PolkaDots />
      <div style={{
        position: 'absolute',
        top: '13%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img
          src="/pwa-192x192.png"
          alt="Logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            background: '#fff'
          }}
        />
      </div>
      <div style={{
        position: 'relative',
        zIndex: 3,
        marginTop: 180,
        width: 340,
        maxWidth: '90vw',
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: 60,
          zIndex: 3
        }}>
          <ProjectileTop />
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '32px 24px 24px 24px',
          marginTop: -12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 240px)',
          justifyContent: 'flex-start'
        }}>
          <div style={{ color: '#222', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Welcome to</div>
          <div style={{
            fontFamily: 'Brittany, cursive',
            fontSize: 32,
            color: '#222',
            marginBottom: 8,
            fontWeight: 700,
            letterSpacing: 1
          }}>
            Lam Bo Guan
          </div>
          <div style={{ color: '#939598', fontSize: 15, marginBottom: 24 }}>Sign in to continue.</div>
          <div style={{ color: '#939598', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>USERNAME</div>
          <div style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '75%',
                border: 'none',
                background: '#f5f6f7',
                borderRadius: 12,
                padding: '10px 16px',
                fontSize: 16,
                color: '#222',
                outline: 'none',
                textAlign: 'left'
              }}
              autoComplete="username"
            />
          </div>
          <div style={{ color: '#939598', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>PASSWORD</div>
          <div style={{ width: '100%', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '75%', position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: '#f5f6f7',
                  borderRadius: 12,
                  padding: '10px 40px 10px 16px',
                  fontSize: 16,
                  color: '#222',
                  outline: 'none',
                  textAlign: 'left'
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#939598',
                  fontSize: 18
                }}
                tabIndex={-1}
              >
                {showPw ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <button
            style={{
              width: '75%',
              background: '#38b6ff',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 17,
              cursor: 'pointer',
              marginBottom: 16
            }}
            onClick={() => {
              navigate('/home');
            }}
          >
            Log in
          </button>
          <div style={{ color: '#939598', fontSize: 13, marginBottom: 2 }}>Don't have an account?</div>
          <div
            style={{
              color: '#939598',
              fontSize: 13,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
}