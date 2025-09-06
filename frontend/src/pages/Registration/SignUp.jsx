import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (day) => {
    setDob(`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    setShowCalendar(false);
  };

  const handleSignUp = () => {
    if (username && isValidEmail(email) && password && dob) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 2000);
    }
  };

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const years = Array.from({ length: today.getFullYear() - 1979 }, (_, i) => 1980 + i);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #38b6ff 0%, #2196F3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <img
            src="/pwa-192x192.png"
            alt="Logo"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 8px 0'
          }}>
            Create New
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#38b6ff',
            margin: '0 0 8px 0'
          }}>
            Account
          </h2>
        </div>

        {/* Username Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #f0f0f0',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#38b6ff'}
            onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `2px solid ${!isValidEmail(email) && email.length > 0 ? '#ff5e7f' : '#f0f0f0'}`,
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#38b6ff'}
            onBlur={(e) => e.target.style.borderColor = !isValidEmail(email) && email.length > 0 ? '#ff5e7f' : '#f0f0f0'}
          />
          {!isValidEmail(email) && email.length > 0 && (
            <div style={{ color: '#ff5e7f', fontSize: '12px', marginTop: '4px' }}>
              Please enter a valid email address
            </div>
          )}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 50px 12px 16px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38b6ff'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '18px',
                padding: '4px'
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Date of Birth Field */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Date of Birth
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={dob}
              readOnly
              onClick={() => setShowCalendar(true)}
              placeholder="Select your birthdate"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            />
            {showCalendar && (
              <div style={{
                position: 'absolute',
                top: '50px',
                left: 0,
                right: 0,
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '16px',
                zIndex: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <select
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(Number(e.target.value))}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
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
                    onChange={(e) => setCalendarYear(Number(e.target.value))}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontWeight: '600', fontSize: '12px', padding: '4px' }}>{d}</div>
                  ))}
                  {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`}></div>)}
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handleDateSelect(i + 1)}
                      style={{
                        background: dob === `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}` ? '#38b6ff' : 'transparent',
                        color: dob === `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}` ? '#fff' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#38b6ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={!username || !isValidEmail(email) || !password || !dob}
          style={{
            width: '100%',
            padding: '14px',
            background: (!username || !isValidEmail(email) || !password || !dob) 
              ? '#ccc' 
              : 'linear-gradient(135deg, #38b6ff 0%, #2196F3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (!username || !isValidEmail(email) || !password || !dob) ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            transition: 'all 0.2s ease'
          }}
        >
          Sign Up
        </button>

        {/* Login Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 8px 0'
          }}>
            Already have an account?
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#38b6ff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          color: '#333',
          fontWeight: '600',
          fontSize: '14px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: '16px 24px',
          zIndex: 9999
        }}>
          Account created successfully! Redirecting to login...
        </div>
      )}
    </div>
  );
}