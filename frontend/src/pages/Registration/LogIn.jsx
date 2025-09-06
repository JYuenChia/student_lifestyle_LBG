import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '@/assets/images/logo.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here
    console.log('Login attempted with:', { username, password });
    navigate('/home');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

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
            src={logo}
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
            Welcome to
          </h1>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#38b6ff',
            margin: '0 0 8px 0'
          }}>
            LBG
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

        {/* Password Field */}
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #38b6ff 0%, #2196F3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Log in
        </button>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 8px 0'
          }}>
            Don't have an account?
          </p>
          <button
            onClick={handleSignUpClick}
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
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}