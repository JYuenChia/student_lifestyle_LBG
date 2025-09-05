import { useState, useEffect } from 'react';

const timeOptions = [];
for (let h = 1; h <= 12; h++) {
  timeOptions.push(`${h}:00`);
  timeOptions.push(`${h}:30`);
}
const repeatOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function AddTaskModal({ show, onClose, onAdd, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || new Date());
  const [month, setMonth] = useState((initialData?.date || new Date()).getMonth());
  const [year, setYear] = useState((initialData?.date || new Date()).getFullYear());
  const [selectedDay, setSelectedDay] = useState((initialData?.date || new Date()).getDate());
  const [time, setTime] = useState(initialData?.time || '8:00');
  const [ampm, setAmpm] = useState(initialData?.ampm || 'AM');
  const [repeat, setRepeat] = useState(initialData?.repeat || 'None');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handleDayClick = d => setSelectedDay(d);

useEffect(() => {
  if (show) {
    if (initialData) {
      setTitle(initialData.title || '');
      setDate(initialData.date || new Date());
      setMonth((initialData.date || new Date()).getMonth());
      setYear((initialData.date || new Date()).getFullYear());
      setSelectedDay((initialData.date || new Date()).getDate());
      setTime(initialData.time || '8:00');
      setAmpm(initialData.ampm || 'AM');
      setRepeat(initialData.repeat || 'None');
    } else {
      setTitle(''); // <-- show placeholder only
      setDate(new Date());
      setMonth(new Date().getMonth());
      setYear(new Date().getFullYear());
      setSelectedDay(new Date().getDate());
      setTime('8:00');
      setAmpm('AM');
      setRepeat('None');
    }
  }
}, [show, initialData]);

  if (!show) return null;

return (
  <>
    <style>
      {`
        .task-title-input::placeholder {
          color: #f5f6f7;
          opacity: 1;
        }
      `}
    </style>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          minWidth: 320,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: '#38b6ff',
            borderRadius: 16,
            padding: '8px 0',
            marginBottom: 16,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <input
            className="task-title-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Name your task..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 20,
              fontWeight: 600,
              padding: '8px 16px',
              width: '90%',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ color: '#222', fontWeight: 500, fontSize: 16, marginBottom: 8, width: '100%' }}>📆 Date</div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 12,
            marginBottom: 16,
            width: '100%',
            color: '#222',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              style={{
                borderRadius: 12,
                border: '1px solid #38b6ff',
                padding: '4px 8px',
                marginRight: 8,
                outline: 'none',
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              style={{
                borderRadius: 12,
                border: '1px solid #38b6ff',
                padding: '4px 8px',
                outline: 'none',
              }}
            >
              {Array.from({ length: 5 }, (_, i) => year - 2 + i).map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: 600, fontSize: 12 }}>
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`}></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleDayClick(i + 1)}
                style={{
                  background: selectedDay === i + 1 ? '#38b6ff' : 'transparent',
                  color: selectedDay === i + 1 ? '#fff' : '#222',
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
        </div>
        <div style={{ color: '#222', fontWeight: 500, fontSize: 16, marginBottom: 8, width: '100%' }}>🕑 Time</div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #222',
            padding: 8,
            marginBottom: 16,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <select
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 16 }}
          >
            {timeOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            value={ampm}
            onChange={e => setAmpm(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 16 }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div style={{ color: '#222', fontWeight: 500, fontSize: 16, marginBottom: 8, width: '100%' }}>🔁 Repeat</div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #222',
            padding: 8,
            marginBottom: 16,
            width: '100%',
          }}
        >
          <select
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 16, width: '100%' }}
          >
            {repeatOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => {
              onAdd({
                title,
                date: new Date(year, month, selectedDay),
                time,
                ampm,
                repeat,
                done: false,
              });
              onClose();
            }}
            style={{
              background: '#38b6ff',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '8px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {initialData ? 'Save' : 'Add'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              color: '#38b6ff',
              border: '1px solid #38b6ff',
              borderRadius: 16,
              padding: '8px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  </>
);
}