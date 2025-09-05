import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PolkaDots() {
  const dots = [];
  while (dots.length < 28) {
    const size = 20 + Math.random() * 24;
    const top = Math.random() * (100 - size / 4);
    const left = Math.random() * (100 - size / 4);
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [dob, setDob] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  function handleDateSelect(day) {
    setDob(`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    setShowCalendar(false);
  }

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const years = Array.from({ length: today.getFullYear() - 1979 }, (_, i) => 1980 + i);

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
        position: 'relative',
        zIndex: 3,
        marginTop: 100,
        width: 340,
        maxWidth: '90vw',
        minHeight: 'calc(100vh - 100px)',
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
          minHeight: 'calc(100vh - 160px)',
          justifyContent: 'flex-start'
        }}>
          <div style={{ color: '#222', fontWeight: 700, fontSize: 24, marginBottom: 2 }}>Create New</div>
          <div style={{ color: '#222', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Account</div>
          <div style={{ color: '#222', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>USERNAME</div>
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
          <div style={{ color: '#222', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>EMAIL</div>
          <div style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              autoComplete="email"
            />
          </div>
          {!isValidEmail(email) && email.length > 0 && (
            <div style={{ color: '#ff5e7f', fontSize: 12, marginBottom: 8, alignSelf: 'flex-start' }}>
              Please enter a valid email address.
            </div>
          )}
          <div style={{ color: '#222', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>PASSWORD</div>
          <div style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
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
                autoComplete="new-password"
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
          <div style={{ color: '#222', fontWeight: 600, fontSize: 13, alignSelf: 'flex-start', marginBottom: 4 }}>DATE OF BIRTH</div>
          <div style={{ width: '100%', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '75%', position: 'relative' }}>
              <input
                type="text"
                value={dob}
                readOnly
                onClick={() => setShowCalendar(true)}
                placeholder="Select your birthdate"
                style={{
                  width: '100%',
                  border: 'none',
                  background: '#f5f6f7',
                  borderRadius: 12,
                  padding: '10px 16px',
                  fontSize: 16,
                  color: '#222',
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              />
              {showCalendar && (
                <div style={{
                  position: 'absolute',
                  top: 44,
                  left: 0,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                  padding: 16,
                  zIndex: 10,
                  minWidth: 260
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <select
                      value={calendarMonth}
                      onChange={e => setCalendarMonth(Number(e.target.value))}
                      style={{
                        fontSize: 15,
                        borderRadius: 8,
                        border: '1px solid #38b6ff',
                        padding: '2px 8px',
                        marginRight: 8,
                        outline: 'none',
                        background: '#f5f6f7',
                        color: '#222'
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={calendarYear}
                      onChange={e => setCalendarYear(Number(e.target.value))}
                      style={{
                        fontSize: 15,
                        borderRadius: 8,
                        border: '1px solid #38b6ff',
                        padding: '2px 8px',
                        outline: 'none',
                        background: '#f5f6f7',
                        color: '#222'
                      }}
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <div key={d} style={{ textAlign: 'center', fontWeight: 600, fontSize: 12 }}>{d}</div>
                    ))}
                    {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handleDateSelect(i + 1)}
                        style={{
                          background: dob === `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}` ? '#38b6ff' : 'transparent',
                          color: dob === `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}` ? '#fff' : '#222',
                          border: 'none',
                          borderRadius: 8,
                          width: 28,
                          height: 28,
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: 14,
                          margin: 1,
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCalendar(false)}
                    style={{
                      marginTop: 8,
                      background: '#38b6ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 16px',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
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
              setShowPopup(true);
              setTimeout(() => {
                setShowPopup(false);
                navigate('/login');
              }, 2200);
            }}
            disabled={
              !username ||
              !isValidEmail(email) ||
              !password ||
              !dob
            }
          >
            Sign Up
          </button>
          <div style={{ color: '#939598', fontSize: 13, marginBottom: 2 }}>Already have an account?</div>
          <div
            style={{
              color: '#939598',
              fontSize: 13,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </div>
        </div>
      </div>
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          color: '#222',
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          padding: '16px 32px',
          zIndex: 9999,
          marginTop: 16
        }}>
          Your account has been successfully registered.<br />You may proceed to log in now.
        </div>
        )}
    </div>
  );
}