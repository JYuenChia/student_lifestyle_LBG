import { useState } from 'react';
import BottomBar from './bottomBar';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('Calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Mock data for mood tracking
  const moodData = {
    1: '😊', 2: '😐', 3: '😊', 4: '😊',
    // Add more dates as needed
  };

  const journalEntries = [
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
  ];

  const generateCalendar = () => {
    const daysInMonth = 30; // November has 30 days
    const firstDay = 5; // November 1, 2025 starts on Saturday
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const mood = moodData[day];
      days.push(
        <div
          key={day}
          className="h-12 flex flex-col items-center justify-center border rounded-md cursor-pointer hover:bg-gray-50 relative"
          onClick={() => setSelectedDate(day)}
        >
          <span className="text-sm font-medium">{day}</span>
          {mood && (
            <span className="text-xs absolute -top-1 -right-1">{mood}</span>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-500 p-4 relative"
      style={{ fontFamily: "'Canva Sans', sans-serif", paddingBottom: '84.6px' }}
    >
      {/* Blue rounded rectangle */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-55px',
          width: '100%',
          height: '180px',
          backgroundColor: '#38b6ff',
          borderRadius: '40px',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
        ></div>
      {/* White rounded rectangle for message */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '10px',
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
          transform: 'translateX(-50%)',
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
      {/* Editable journal input in white rounded rectangle */}
      <div
        style={{
          position: 'absolute',
          left: '29.1px',
          top: '88.4px',
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
            color: '#222', // Text color when typing
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
      {/* Button group below blue rectangle */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '140px', // Adjust as needed to sit below blue rectangle
          width: '360.4px',
          height: '46.7px',
          backgroundColor: '#f5f6f7',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 22,
          transform: 'translateX(-50%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden" style={{marginTop: '0px'}}>

        {/* Calendar Section */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Calendar</h2>
            <p className="text-gray-600 text-sm">November 2025</p>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendar()}
            </div>
          </div>

          {/* Journal Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              My Journal on {journalEntries[0].date}...
            </h3>
            
            <div className="space-y-3">
              {journalEntries[0].entries.map((entry, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "{entry}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
      </div>
      <BottomBar />
    </div>
  );
}