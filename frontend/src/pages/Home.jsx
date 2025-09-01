import { useState } from 'react';

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-500 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-400 p-6 text-white">
          <div className="bg-blue-300 rounded-2xl p-4 mb-4">
            <p className="text-sm">
              Hey there, take a deep breath — you're doing better than you think! 
              Ready to check in and lighten your load today?
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button className="bg-white text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
              Calendar
            </button>
            <button className="text-white px-4 py-2 rounded-full text-sm">
              Mood Analysis
            </button>
            <button className="text-white px-4 py-2 rounded-full text-sm">
              Period Tracker
            </button>
          </div>
        </div>

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
        <div className="flex justify-center space-x-8 p-6 border-t border-gray-200">
          <button className="p-3 rounded-full">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <button className="p-3 rounded-full">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7H3v2h2v13h14V6h2V4h-4V2H7v2H3zm2 2v11H5V6h12z"/>
            </svg>
          </button>
          <button className="p-3 rounded-full">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}