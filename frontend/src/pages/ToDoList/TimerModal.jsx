import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

export default function TimerModal({ show, onClose }) {
  const [minute, setMinute] = useState(25);
  const [second, setSecond] = useState(0);
  const [editing, setEditing] = useState(null); // 'minute' or 'second'
  const [time, setTime] = useState(1500); // seconds
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [justRestarted, setJustRestarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTime(minute * 60 + second);
  }, [minute, second, show]);

  useEffect(() => {
    if (running && !paused && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(t => t > 0 ? t - 1 : 0);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, paused, time]);

  const total = minute * 60 + second || 1;
  const percent = time / total;
  const radius = 100;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);

  const formatTime = t => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return {
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const timeObj = formatTime(time);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 32,
        padding: 24,
        minWidth: 300,
        maxWidth: 340,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Animated Timer */}
        <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 24 }}>
          <svg width={220} height={220}>
            <circle
              cx={110}
              cy={110}
              r={radius}
              stroke="#e0e0e0"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={110}
              cy={110}
              r={radius}
              stroke="url(#timer-gradient)"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
              transform="rotate(-90 110 110)" // Start at 12, clockwise
            />
            <defs>
                <linearGradient
                    id="timer-gradient"
                    x1="10"
                    y1="110"
                    x2="210"
                    y2="110"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#38b6ff" />
                    <stop offset="100%" stopColor="#627edc" />
                </linearGradient>
                </defs>
          </svg>
          {/* Timer Text */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#222', display: 'flex', gap: 8 }}>
              {/* Editable MM:SS */}
              <span
                style={{
                  cursor: 'pointer',
                  borderBottom: editing === 'minute' ? '2px solid #38b6ff' : 'none'
                }}
                onClick={() => setEditing('minute')}
              >
                {editing === 'minute' ? (
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={minute}
                    onChange={e => {
                      let val = Math.max(0, Math.min(99, Number(e.target.value)));
                      setMinute(val);
                    }}
                    onBlur={() => setEditing(null)}
                    style={{
                      width: 40,
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#222',
                      textAlign: 'center',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                ) : timeObj.m}
              </span>
              <span>:</span>
              <span
                style={{
                  cursor: 'pointer',
                  borderBottom: editing === 'second' ? '2px solid #38b6ff' : 'none'
                }}
                onClick={() => setEditing('second')}
              >
                {editing === 'second' ? (
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={second}
                    onChange={e => {
                      let val = Math.max(0, Math.min(99, Number(e.target.value)));
                      setSecond(val);
                    }}
                    onBlur={() => setEditing(null)}
                    style={{
                      width: 40,
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#222',
                      textAlign: 'center',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent'
                    }}
                  />
                ) : timeObj.s}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
              <button
                onClick={() => {
                  if (running) setPaused(p => !p);
                  else { setRunning(true); setPaused(false); }
                }}
                style={{
                  background: (paused || (!running && !paused)) ? '#38b6ff' : '#f5f6f7',
                  border: 'none',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  fontSize: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: (paused || (!running && !paused)) ? '0 2px 8px rgba(56,182,255,0.18)' : 'none'
                }}
              >
                {running ? (paused ? <FaPlay color="#fff" /> : <FaPause color="#38b6ff" />) : <FaPlay color="#fff" />}
              </button>
              <button
                onClick={() => {
                  setTime(minute * 60 + second);
                  setPaused(false);
                  setRunning(true);
                  setJustRestarted(true);
                  setTimeout(() => setJustRestarted(false), 300);
                }}
                style={{
                  background: justRestarted ? '#38b6ff' : '#f5f6f7',
                  border: 'none',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  fontSize: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: justRestarted ? '0 2px 8px rgba(56,182,255,0.18)' : 'none'
                }}
              >
                <FaRedo color={justRestarted ? "#fff" : "#38b6ff"} />
              </button>
            </div>
          </div>
        </div>
        <div style={{ color: '#222', fontWeight: 500, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>
          Keep going,<br />you've got this!
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff5e7f',
            textDecoration: 'underline',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
}