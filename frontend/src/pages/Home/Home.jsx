import { useState, useEffect } from "react";
import MoodPicker from "./MoodPicker";
import EditJournalWindow from "./EditJournal";
import Calendar from "./Calendar";
import MoodAnalysis from "./MoodAnalysis";
import PeriodTracker from "./PeriodTracker"; // Add this import

export default function Home() {
  // console.log("Home component rendered"); // Debug log
  const [selectedTab, setSelectedTab] = useState("Calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showMoodPicker, setShowMoodPicker] = useState(false); // Default to false

  const [editingTodayJournal, setEditingTodayJournal] = useState(false);
  const [editJournalValue, setEditJournalValue] = useState("");
  const [showEditJournalWindow, setShowEditJournalWindow] = useState(false);
  const [editJournalEmoji, setEditJournalEmoji] = useState(null);

  const [moodData, setMoodData] = useState({
    "1 September 2025": "😐",
    "2 September 2025": "😖",
    "3 September 2025": "😢",
  });

  const [journalEntries, setJournalEntries] = useState([
    {
      date: "1 September 2025",
      entries: [
        "Today felt heavy... like someone forgot to toast my bread today!",
        "I avoided hanging out with friends at lunch. Didn't feel like talking to anyone.",
      ],
    },
    {
      date: "2 September 2025",
      entries: [
        "Skipped breakfast because I overslept, and I've been feeling low on energy all day.",
        "Couldn't focus in class. My mind kept wandering and I missed half the lecture.",
      ],
    },
    {
      date: "3 September 2025",
      entries: [
        "Deep down, I just feel lonely and unmotivated, like I'm stuck in quicksand.",
        "Maybe tomorrow will be better if I get some rest.",
      ],
    },
  ]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const years = ["2023", "2024", "2025", "2026", "2027"];

  useEffect(() => {
    // console.log("useEffect triggered"); // Debug log
    const today = new Date();
    setSelectedMonth(months[today.getMonth()]);
    setSelectedYear(today.getFullYear().toString());
    setSelectedDate(today.getDate());

    // Check if mood has already been saved for today
    const todayStr = getTodayDateStr();
    if (!moodData[todayStr]) {
      setShowMoodPicker(true); // Show MoodPicker only if no mood is saved
    } else {
      setShowMoodPicker(false); // Ensure MoodPicker does not pop out again
    }
  }, []); // Run only on initial render

  // Helpers
  function getTodayDateStr() {
    const today = new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear().toString();
    return `${day} ${month} ${year}`;
  }

  function getTodaysJournalEntry() {
    const todayStr = getTodayDateStr();
    const entry = journalEntries.find((j) => j.date === todayStr);
    return entry && entry.entries.length > 0
      ? entry.entries[entry.entries.length - 1]
      : "";
  }

  // Handlers (same as before, not removing)
  function handleSaveJournal({ mood, emoji, journal }) {
    const todayStr = getTodayDateStr();
    setMoodData((prev) => ({ ...prev, [todayStr]: emoji || mood }));
    setJournalEntries((prev) => {
      const existing = prev.find((j) => j.date === todayStr);
      if (existing) {
        if (editingTodayJournal) {
          return prev.map((j) =>
            j.date === todayStr
              ? { ...j, entries: [...j.entries.slice(0, -1), journal] }
              : j
          );
        } else {
          return prev.map((j) =>
            j.date === todayStr ? { ...j, entries: [...j.entries, journal] } : j
          );
        }
      } else {
        return [...prev, { date: todayStr, entries: [journal] }];
      }
    });

    // Ensure MoodPicker and EditJournalWindow are closed and do not reopen
    setShowMoodPicker(false); // Ensure MoodPicker does not pop out again
    setEditingTodayJournal(false);
    setEditJournalValue("");
    setShowEditJournalWindow(false);
  }

  function handleContinueEditJournal() {
    const todayStr = getTodayDateStr();
    const emoji = moodData[todayStr];
    setEditJournalEmoji(emoji);
    setEditJournalValue(getTodaysJournalEntry());
    setShowEditJournalWindow(true);
  }

  function handleEditJournalDone() {
    const todayStr = getTodayDateStr();
    setJournalEntries((prev) => {
      const existing = prev.find((j) => j.date === todayStr);
      if (existing) {
        return prev.map((j) =>
          j.date === todayStr
            ? { ...j, entries: [...j.entries.slice(0, -1), editJournalValue] }
            : j
        );
      } else {
        return [...prev, { date: todayStr, entries: [editJournalValue] }];
      }
    });
    setShowEditJournalWindow(false);
    setEditJournalValue("");
  }

  function handleEditJournalCancel() {
    setShowEditJournalWindow(false);
    setEditJournalValue("");
  }

  function handleEditJournalEmoji() {
    setShowEditJournalWindow(false);
    setShowMoodPicker(true);
    setEditingTodayJournal(true);
  }

  const shouldShowMoodPicker =
    showMoodPicker &&
    !moodData[getTodayDateStr()] &&
    !journalEntries.find((j) => j.date === getTodayDateStr());

  function handleTabChange(tab) {
    setSelectedTab(tab);
  }

  // MoodPicker modal
  if (shouldShowMoodPicker) {
    return (
      <MoodPicker
        onClose={() => {
          setShowMoodPicker(false);
          setEditingTodayJournal(false);
          setEditJournalValue("");
        }}
        onSave={handleSaveJournal}
        editJournalValue={editingTodayJournal ? editJournalValue : undefined}
      />
    );
  }

  if (showMoodPicker && editingTodayJournal) {
    return (
      <MoodPicker
        onClose={() => {
          setShowMoodPicker(false);
          setEditingTodayJournal(false);
          setEditJournalValue("");
        }}
        onSave={handleSaveJournal}
        editJournalValue={editJournalValue}
        editingTodayJournal={true}
      />
    );
  }

  if (showEditJournalWindow) {
    return (
      <EditJournalWindow
        emoji={editJournalEmoji}
        journal={editJournalValue}
        onChangeJournal={setEditJournalValue}
        onEditEmoji={handleEditJournalEmoji}
        onDone={handleEditJournalDone}
        onCancel={handleEditJournalCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-500 p-4 relative">
      {/* Header */}
      <div
        style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#38b6ff",
          borderRadius: "40px",
          marginTop: "-55px",
        }}
      />
      <div
        style={{
          width: "85%",
          maxWidth: "361.3px",
          height: "62px",
          backgroundColor: "#fff",
          borderRadius: "24px",
          margin: "0 auto",
          marginTop: "-140px",
          marginBottom: "18px", // Reduced margin below the white rectangle
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
        }}
      >
        <p className="text-sm text-gray-800 text-center">
          Hey there, take a deep breath — you're doing better than you think!<br />
          Ready to check in and lighten your load today?
        </p>
      </div>

      {/* Continue Edit Button */}
      <div
        style={{
          width: "220px",
          height: "32px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          margin: "16px auto", // Removed top margin to bring it closer to the white rectangle
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            color: "#38b6ff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={handleContinueEditJournal}
        >
          Continue edit today's journal...
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          width: "360.4px",
          height: "46.7px",
          backgroundColor: "#f5f6f7",
          borderRadius: "18px",
          margin: "24px auto 0 auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {["Calendar", "Mood Analysis", "Period Tracker"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              border: "none",
              background: selectedTab === tab ? "#38b6ff" : "transparent",
              color: selectedTab === tab ? "#fff" : "#555",
              padding: "8px 12px",
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-6">
        {selectedTab === "Calendar" && (
          <Calendar
            months={months}
            years={years}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedDate={selectedDate}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            setSelectedDate={setSelectedDate}
            moodData={moodData}
            journalEntries={journalEntries}
          />
        )}

        {selectedTab === "Mood Analysis" && (
          <MoodAnalysis moodData={moodData} /> 
        )}

        {selectedTab === "Period Tracker" && (
          <PeriodTracker
            moodData={moodData}
            // Optionally pass cycleLength and lastPeriodDate as props if needed
          />
        )}
      </div>
    </div>
  );
}
