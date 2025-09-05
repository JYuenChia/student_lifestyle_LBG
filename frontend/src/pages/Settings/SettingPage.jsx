import { useState } from 'react';
import { FaMoon, FaFont, FaEye, FaShieldAlt, FaBell, FaPhone, FaChevronRight, FaPen, FaCheck } from 'react-icons/fa';
import BottomBar from '../bottomBar';

const universityOptions = [
  "Universiti Malaya",
  "Universiti Putra Malaysia",
  "Universiti Kebangsaan Malaysia",
  "Universiti Teknologi Malaysia",
  "Universiti Sains Malaysia",
  "Sunway University College"
];

export default function SettingPage() {
  const [editing, setEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('/default-profile.png');
  const [username, setUsername] = useState('John Doe');
  const [university, setUniversity] = useState(universityOptions[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(false);
  const [colourblind, setColourblind] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState(false);
  const [reminders, setReminders] = useState(false);

  const handleProfilePicChange = e => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveProfile = () => setEditing(false);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f6f7',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
          <div style={{
      maxWidth: 400,
      margin: '0 auto',
      padding: '32px 0'
    }}> </div>
      {/* Title */}
      <div style={{ fontSize: 24, fontWeight: 700, color: '#222', marginTop: 32, marginLeft: 24, marginBottom: 16 }}>
        Settings
      </div>
      {/* Profile Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <img
            src={profilePic}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          {editing && (
            <label style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: '#38b6ff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(56,182,255,0.18)'
            }}>
              <FaPen color="#fff" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
            </label>
          )}
        </div>
        {/* Username */}
        <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginTop: 16 }}>
          {editing ? (
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: '#222',
                border: 'none',
                borderBottom: '2px solid #38b6ff',
                background: 'transparent',
                textAlign: 'center',
                outline: 'none'
              }}
            />
          ) : username}
        </div>
        {/* University Name + Edit/Save */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
          {editing ? (
            <select
              value={university}
              onChange={e => setUniversity(e.target.value)}
              style={{
                color: '#939598',
                fontSize: 15,
                border: 'none',
                borderBottom: '2px solid #38b6ff',
                background: 'transparent',
                outline: 'none'
              }}
            >
              {universityOptions.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          ) : (
            <span style={{ color: '#939598', fontSize: 15 }}>{university}</span>
          )}
          <button
            onClick={editing ? handleSaveProfile : () => setEditing(true)}
            style={{
              background: 'none',
              border: 'none',
              marginLeft: 8,
              cursor: 'pointer',
              padding: 2
            }}
          >
            {editing ? <FaCheck color="#38b6ff" size={18} /> : <FaPen color="#939598" size={16} />}
          </button>
        </div>
      </div>
      {/* Appearance Section */}
      <div style={{ fontWeight: 700, color: '#222', fontSize: 16, marginLeft: 24, marginBottom: 8 }}>
        Appearance
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '16px 20px',
        margin: '0 16px 24px 16px'
      }}>
        <SettingSwitch
          icon={<FaMoon color="#222" />}
          label="Dark Mode"
          value={darkMode}
          onChange={() => setDarkMode(v => !v)}
        />
        <SettingSwitch
          icon={<FaFont color="#222" />}
          label="Font Size"
          value={fontSize}
          onChange={() => setFontSize(v => !v)}
        />
        <SettingSwitch
          icon={<FaEye color="#222" />}
          label="Colourblind Mode"
          value={colourblind}
          onChange={() => setColourblind(v => !v)}
        />
      </div>
      {/* Privacy Section */}
      <div style={{ fontWeight: 700, color: '#222', fontSize: 16, marginLeft: 24, marginBottom: 8 }}>
        Privacy
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '16px 20px',
        margin: '0 16px 24px 16px'
      }}>
        <SettingSwitch
          icon={<FaShieldAlt color="#222" />}
          label="Data Privacy"
          value={dataPrivacy}
          onChange={() => setDataPrivacy(v => !v)}
        />
        <SettingSwitch
          icon={<FaBell color="#222" />}
          label="Enable Reminders"
          value={reminders}
          onChange={() => setReminders(v => !v)}
        />
      </div>
      {/* Support Section */}
      <div style={{ fontWeight: 700, color: '#222', fontSize: 16, marginLeft: 24, marginBottom: 8 }}>
        Support
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '16px 20px',
        margin: '0 16px 24px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaPhone color="#222" />
          <span style={{ color: '#222', fontWeight: 500, fontSize: 15 }}>Hotline</span>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
          onClick={() => {/* navigate to hotline page */}}
        >
          <FaChevronRight color="#939598" size={18} />
        </button>
      </div>
      {/* Logout */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '16px 0 32px 0'
      }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#ff5e7f',
            textDecoration: 'underline',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => {/* handle logout */}}
        >
          Logout
        </button>
      </div>
      <BottomBar />
    </div>
  );
}

function SettingSwitch({ icon, label, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <span style={{ color: '#222', fontWeight: 500, fontSize: 15 }}>{label}</span>
      </div>
      <div
        onClick={onChange}
        style={{
          width: 44,
          height: 24,
          background: value ? '#38d39f' : '#e0e0e0',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s',
          position: 'relative'
        }}
      >
        <div style={{
          width: 20,
          height: 20,
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          left: value ? 22 : 2,
          transition: 'left 0.2s'
        }} />
      </div>
    </div>
  );
}
