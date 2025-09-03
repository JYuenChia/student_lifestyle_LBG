import { useState } from 'react';
import MoodPicker from './MoodPicker';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('Calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showMoodPicker, setShowMoodPicker] = useState(true);

  // --- Add these states for mood and journal ---
  const [moodData, setMoodData] = useState({
    1: '😊', 2: '😐', 3: '😊', 4: '😊',
    // Add more dates as needed
  });
  const [journalEntries, setJournalEntries] = useState([
    {
      date: "18 November 2025",
      entries: [
        "Today felt heavy... like someone forgot to toast my bread today!",
        "I avoided hanging out with friends at lunch. Didn't feel like talking to anyone.",
        "Skipped breakfast because I overslept, and I've been feeling low on energy all day.",
        "Couldn't focus in class. My mind kept wandering and I missed half the lecture.",
        "Deep down, I just feel lonely and unmotivated, like I'm stuck in quicksand.",
        "Maybe tomorrow will be better if I get some rest."
      ]
    }
  ]);
  // --- end add ---

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = ['2023', '2024', '2025', '2026', '2027'];

  // Helper to get days in month and first day of week for any year/month
  function getMonthMeta(monthName, year) {
    const monthIndex = months.indexOf(monthName);
    const date = new Date(Number(year), monthIndex, 1);
    const daysInMonth = new Date(Number(year), monthIndex + 1, 0).getDate();
    const firstDay = date.getDay(); // 0=Sunday, 1=Monday, ...
    return { daysInMonth, firstDay };
  }

  // Helper to get journal for selected date
  function getJournalForSelectedDate() {
    if (!selectedDate) return null;
    const selectedDateStr = `${selectedDate} ${selectedMonth} ${selectedYear}`;
    const entry = journalEntries.find(j =>
      j.date === selectedDateStr
    );
    return entry ? entry.entries : null;
  }

  const generateCalendar = () => {
    const { daysInMonth, firstDay } = getMonthMeta(selectedMonth, selectedYear);
    const days = [];
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDay + 1;
      if (i < firstDay || day > daysInMonth) {
        days.push(
          <div
            key={`empty-${i}`}
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              background: '#f5f6f7',
              borderRadius: '10px',
              border: '1px solid #e0e3e7'
            }}
          ></div>
        );
      } else {
        const mood = moodData[day];
        const isSelected =
          selectedDate === day &&
          selectedMonth === months[new Date(Number(selectedYear), months.indexOf(selectedMonth), 1).getMonth()] &&
          selectedYear === String(selectedYear);
        days.push(
          <div
            key={day}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setSelectedDate(day)}
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              background: "#fff",
              borderRadius: '10px',
              border: isSelected
                ? '2.5px solid #38b6ff'
                : '1.5px solid #e0e3e7',
              position: 'relative',
              boxShadow: '0 1px 4px rgba(56,182,255,0.04)'
            }}
          >
            {/* Date at upper left */}
            <span
              style={{
                position: 'absolute',
                top: '6px',
                left: '8px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#222'
              }}
            >
              {day}
            </span>
            {/* Emoji centered */}
            {mood && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '20px'
                }}
              >
                {mood}
              </span>
            )}
          </div>
        );
      }
    }

    return days;
  };

  // --- Add this handler for saving mood and journal ---
  function handleSaveJournal({ mood, emoji, journal }) {
    // Get today's date
    const today = new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear().toString();
    const dateStr = `${day} ${month} ${year}`;

    // Save mood (emoji) for today
    setMoodData(prev => ({
      ...prev,
      [day]: emoji || mood
    }));

    // Save journal entry for today
    setJournalEntries(prev => {
      const existing = prev.find(j => j.date === dateStr);
      if (existing) {
        return prev.map(j =>
          j.date === dateStr
            ? { ...j, entries: [...j.entries, journal] }
            : j
        );
      } else {
        return [...prev, { date: dateStr, entries: [journal] }];
      }
    });

    setShowMoodPicker(false);
  }
  // --- end add ---

  if (showMoodPicker) {
    return (
      <>
        {/* Keep the background only for MoodPicker modal */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(56,182,255,0.10)',
              padding: '0',
              minWidth: '340px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              overflow: 'auto'
            }}
          >
            <MoodPicker
              onClose={() => setShowMoodPicker(false)}
              onSave={handleSaveJournal}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-500 p-4 relative"
      style={{ fontFamily: "'Canva Sans', sans-serif", paddingBottom: '84.6px' }}
    >
      {/* Removed <MovingGradientBg /> */}
      {/* Blue rounded rectangle (now in normal flow) */}
      <div
        style={{
          width: '100%',
          height: '180px',
          backgroundColor: '#38b6ff',
          borderRadius: '40px',
          margin: '0 auto',
          marginTop: '-55px',
          zIndex: 10,
        }}
      ></div>
      {/* White rounded rectangle for message (now in normal flow) */}
      <div
        style={{
          width: '85%',
          maxWidth: '361.3px',
          height: '62px',
          backgroundColor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          padding: '0 16px',
          margin: '0 auto',
          marginTop: '-140px',
          position: 'relative',
        }}
      >
        <p
          className="text-sm text-gray-800 text-center"
          style={{ lineHeight: '1.3', 
                  fontFamily: "'Canva Sans', sans-serif",
                  fontSize: '14px'
                 }}
        >
          Hey there, take a deep breath — you're doing better than you think!<br />
          Ready to check in and lighten your load today?
        </p>
      </div>
      {/* Editable journal input in white rounded rectangle (now in normal flow) */}
      <div
        style={{
          width: '168.5px',
          height: '25.2px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 21,
          padding: '0 8px',
          margin: '16px auto 0 auto',
        }}
      >
        <input
          type="text"
          placeholder="Add today's journal..."
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#222',
            fontSize: '12px',
            fontFamily: "'Canva Sans', sans-serif",
          }}
          className="placeholder-journal"
        />
        <style>
          {`
            .placeholder-journal::placeholder {
              color: #c8c8c8;
              font-family: 'Canva Sans', sans-serif;
            }
          `}
        </style>
      </div>
      {/* Button group below blue rectangle (now in normal flow) */}
      <div
        style={{
          width: '360.4px',
          height: '46.7px',
          backgroundColor: '#f5f6f7',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 22,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          margin: '24px auto 0 auto',
        }}
      >
        {['Calendar', 'Mood Analysis', 'Period Tracker'].map(tab => (
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
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Main content */}
      <div
        className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        style={{ marginTop: '32px' }}
      >
        {/* Main content under tab selection */}
        {selectedTab === 'Calendar' && (
          <div className="p-6 bg-card">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Calendar</h2>
              {/* Month/year selection bar - improved UI */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f5f6f7',
                  borderRadius: '14px',
                  padding: '0 20px',
                  height: '48px',
                  width: 'fit-content',
                  minWidth: '220px',
                  marginBottom: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  border: '1.5px solid #e0e3e7',
                  gap: '12px',
                  fontFamily: "'Canva Sans', sans-serif",
                  position: 'relative',
                }}
              >
                {/* Calendar icon */}
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '6px',
                  color: '#38b6ff',
                  fontSize: '20px'
                }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="4" fill="#e3f4fd"/>
                    <rect x="3" y="8" width="18" height="13" rx="2" fill="#fff"/>
                    <rect x="3" y="8" width="18" height="13" rx="2" stroke="#38b6ff" strokeWidth="1.5"/>
                    <rect x="7" y="2" width="2" height="6" rx="1" fill="#38b6ff"/>
                    <rect x="15" y="2" width="2" height="6" rx="1" fill="#38b6ff"/>
                  </svg>
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    style={{
                      border: '1px solid #d1eaff',
                      background: '#fff',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: "'Canva Sans', sans-serif",
                      color: '#222',
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '8px 32px 8px 12px',
                      borderRadius: '8px',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      boxShadow: '0 1px 4px rgba(56,182,255,0.07)',
                      transition: 'border 0.2s',
                    }}
                    className="custom-dropdown"
                  >
                    {months.map(month => (
                      <option key={month} value={month} style={{
                        fontWeight: 500,
                        color: '#222',
                        fontFamily: "'Canva Sans', sans-serif",
                        background: selectedMonth === month ? '#e3f4fd' : '#fff',
                        color: selectedMonth === month ? '#38b6ff' : '#222',
                      }}>{month}</option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    pointerEvents: 'none',
                    color: '#38b6ff',
                    fontSize: '16px',
                  }}>▼</span>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    style={{
                      border: '1px solid #d1eaff',
                      background: '#fff',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: "'Canva Sans', sans-serif",
                      color: '#38b6ff',
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '8px 32px 8px 12px',
                      borderRadius: '8px',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      boxShadow: '0 1px 4px rgba(56,182,255,0.07)',
                      transition: 'border 0.2s',
                    }}
                    className="custom-dropdown"
                  >
                    {years.map(year => (
                      <option key={year} value={year} style={{
                        fontWeight: 500,
                        color: '#38b6ff',
                        fontFamily: "'Canva Sans', sans-serif",
                        background: selectedYear === year ? '#e3f4fd' : '#fff',
                        color: selectedYear === year ? '#38b6ff' : '#222',
                      }}>{year}</option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    pointerEvents: 'none',
                    color: '#38b6ff',
                    fontSize: '16px',
                  }}>▼</span>
                </div>
                {/* Dropdown custom styles */}
                <style>
                  {`
                    select.custom-dropdown:focus {
                      border-color: #38b6ff;
                      box-shadow: 0 0 0 2px #e3f4fd;
                    }
                    select.custom-dropdown option {
                      padding: 8px 12px;
                      font-size: 15px;
                      font-family: 'Canva Sans', sans-serif;
                    }
                    /* Chrome/Edge/Safari */
                    select.custom-dropdown::-webkit-scrollbar {
                      width: 8px;
                      background: #f5f6f7;
                    }
                    select.custom-dropdown::-webkit-scrollbar-thumb {
                      background: #e3f4fd;
                      border-radius: 4px;
                    }
                  `}
                </style>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              {/* Week headers */}
              <div
                className="grid grid-cols-7 gap-2 mb-2"
                style={{ minWidth: 0 }}
              >
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div
                    key={day}
                    className="flex items-center justify-center text-sm font-medium text-muted-foreground"
                    style={{
                      width: '44px',
                      height: '32px',
                      minWidth: '44px',
                      minHeight: '32px',
                      background: '#f5f6f7',
                      borderRadius: '8px'
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div
                className="grid grid-cols-7 gap-x-2"
                style={{
                  minWidth: 0,
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '8px 0',
                  rowGap: '12px'
                }}
              >
                {generateCalendar()}
              </div>
            </div>

            {/* Journal Section for selected date */}
            {selectedDate && getJournalForSelectedDate() && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  My Journal on {selectedDate} {selectedMonth} {selectedYear}...
                </h3>
                <div className="space-y-3">
                  {getJournalForSelectedDate().map((entry, index) => (
                    <div key={index} className="bg-muted rounded-lg p-3 border border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{entry}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'Mood Analysis' && (
          <div className="p-6 bg-card flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-xl font-bold text-foreground mb-2">Mood Analysis</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Mood analytics and trends will appear here.
            </p>
            {/* Add mood analysis charts or summaries here */}
            <div className="w-full h-40 flex items-center justify-center bg-muted rounded-lg border border-border">
              <span className="text-muted-foreground">[Mood chart placeholder]</span>
            </div>
          </div>
        )}

        {selectedTab === 'Period Tracker' && (
          <div className="p-6 bg-card flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-xl font-bold text-foreground mb-2">Period Tracker</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Track your cycle and symptoms here.
            </p>
            {/* Add period tracking UI here */}
            <div className="w-full h-40 flex items-center justify-center bg-muted rounded-lg border border-border">
              <span className="text-muted-foreground">[Period tracker placeholder]</span>
            </div>
          </div>
        )}
        {/* Bottom Navigation */}
      </div>
    </div>
  );
}