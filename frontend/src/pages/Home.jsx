import { useState } from 'react';
// import messageIcon from '../assets/images/message-icon.png';
// import communityIcon from '../assets/images/community-icon.png';
// import homeIcon from '../assets/images/home-icon.png';
// import todoIcon from '../assets/images/to-do-list.png';
// import settingIcon from '../assets/images/setting.png';


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
          className="h-12 flex flex-col items-center justify-center border border-border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors relative"
          onClick={() => setSelectedDate(day)}
        >
          <span className="text-sm font-medium text-foreground">{day}</span>
          {mood && (
            <span className="text-xs absolute -top-1 -right-1">{mood}</span>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="bg-primary/80 rounded-2xl p-4 mb-4 backdrop-blur-sm">
            <p className="text-sm">
              Hey there, take a deep breath — you're doing better than you think! 
              Ready to check in and lighten your load today?
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button className="bg-primary-foreground text-primary px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
              Calendar
            </button>
            <button className="text-primary-foreground/80 px-4 py-2 rounded-full text-sm hover:text-primary-foreground hover:bg-primary/20 transition-colors">
              Mood Analysis
            </button>
            <button className="text-primary-foreground/80 px-4 py-2 rounded-full text-sm hover:text-primary-foreground hover:bg-primary/20 transition-colors">
              Period Tracker
            </button>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="p-6 bg-card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-2">Calendar</h2>
            <p className="text-muted-foreground text-sm">November 2025</p>
          </div>

          {/* Calendar Grid */}
          <div className="mb-6">
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
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
            <h3 className="text-lg font-bold text-foreground mb-4">
              My Journal on {journalEntries[0].date}...
            </h3>
            
            <div className="space-y-3">
              {journalEntries[0].entries.map((entry, index) => (
                <div key={index} className="bg-muted rounded-lg p-3 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{entry}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}