import React from "react";

export default function Calendar({
  months,
  years,
  selectedMonth,
  selectedYear,
  selectedDate,
  setSelectedMonth,
  setSelectedYear,
  setSelectedDate,
  moodData,
  originalMoodData,
  journalEntries,
}) {
  // Helper to get days in month and first day of week
  function getMonthMeta(monthName, year) {
    const monthIndex = months.indexOf(monthName);
    const date = new Date(Number(year), monthIndex, 1);
    const daysInMonth = new Date(Number(year), monthIndex + 1, 0).getDate();
    const firstDay = date.getDay();
    return { daysInMonth, firstDay };
  }

  const moodEmojis = {
    Happy: "😊",
    Loving: "❤️",
    Stress: "😖",
    Mad: "😡",
    Sad: "😢",
    Bored: "😐",
    Fear: "😨",
    Custom: "➕",
  };

  function getMoodLabelFromEmoji(emoji) {
    for (const [label, char] of Object.entries(moodEmojis)) {
      if (char === emoji) return label;
    }
    return emoji;
  }

  // Helper to render emoji or custom emoji image
  function renderCalendarEmoji(mood, dateKey) {
    if (typeof mood === "string" && mood.startsWith("data:image")) {
      return (
        <img
          src={mood}
          alt="Custom emoji"
          style={{
            width: 20,
            height: 20,
            objectFit: "contain",
            display: "block",
            borderRadius: "6px",
            background: "#fff",
            margin: "0 auto",
          }}
        />
      );
    }
    if (typeof mood === "string" && mood.length <= 3 && /\p{Emoji}/u.test(mood)) {
      return <span style={{ fontSize: "20px", lineHeight: "1" }}>{mood}</span>;
    }
    if (typeof mood === "string" && moodEmojis[mood]) {
      return (
        <img
          src={`emojis/${mood}.png`}
          alt={mood}
          style={{
            width: 20,
            height: 20,
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
      );
    }
    // If mood is an emoji character, map to label
    const label = getMoodLabelFromEmoji(mood);
    if (label && moodEmojis[label]) {
      return (
        <img
          src={`emojis/${label}.png`}
          alt={label}
          style={{
            width: 20,
            height: 20,
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
      );
    }
    return <span style={{ fontSize: "20px", lineHeight: "1" }}>{mood}</span>;
  }

  // Build calendar grid
  function generateCalendar() {
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
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              background: "#f5f6f7",
              borderRadius: "10px",
              border: "1px solid #e0e3e7",
            }}
          />
        );
      } else {
        const dateKey = `${day} ${selectedMonth} ${selectedYear}`;
        const mood = moodData[dateKey];
        const isSelected = selectedDate === day;

        days.push(
          <div
            key={day}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setSelectedDate(day)}
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              background: "#fff",
              borderRadius: "10px",
              border: isSelected ? "2.5px solid #38b6ff" : "1.5px solid #e0e3e7",
              position: "relative",
              boxShadow: "0 1px 4px rgba(56,182,255,0.04)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "6px",
                left: "8px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#222",
              }}
            >
              {day}
            </span>
            {mood && (
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {renderCalendarEmoji(mood, dateKey)}
              </span>
            )}
          </div>
        );
      }
    }
    return days;
  }

  // Get journal entries for selected date
  function getJournalForSelectedDate() {
    if (!selectedDate) return null;
    const selectedDateStr = `${selectedDate} ${selectedMonth} ${selectedYear}`;
    const entry = journalEntries.find((j) => j.date === selectedDateStr);
    return entry ? entry.entries : null;
  }

  return (
    <div
      className="p-6"
      style={{
        maxWidth: 540,
        margin: "0 auto",
        fontFamily: "'Canva Sans', sans-serif",
        fontSize: 16,
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 4px 24px 0 rgba(56,182,255,0.06)",
        border: "1.5px solid #e0e3e7",
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#2563eb",
          marginBottom: 18,
          letterSpacing: "0.01em",
        }}
      >
        Calendar
      </h2>

      {/* Month/Year Selection */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f5f6f7",
          borderRadius: "14px",
          padding: "0 20px",
          height: "48px",
          width: "fit-content",
          minWidth: "220px",
          marginBottom: "18px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          border: "1.5px solid #e0e3e7",
          gap: "12px",
          fontFamily: "'Canva Sans', sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              border: "1px solid #d1eaff",
              background: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "'Canva Sans', sans-serif",
              color: "#222",
              outline: "none",
              cursor: "pointer",
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              marginRight: 8,
            }}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              border: "1px solid #d1eaff",
              background: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "'Canva Sans', sans-serif",
              color: "#38b6ff",
              outline: "none",
              cursor: "pointer",
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1.5px solid #e0e3e7",
          padding: "18px 12px 18px 12px",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(56,182,255,0.04)",
        }}
      >
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="flex items-center justify-center text-sm font-medium text-muted-foreground"
              style={{
                width: "44px",
                height: "32px",
                minWidth: "44px",
                minHeight: "32px",
                background: "#f5f6f7",
                borderRadius: "8px",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.01em",
              }}
            >
              {day}
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-7 gap-x-2"
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "8px 0",
            rowGap: "12px",
          }}
        >
          {generateCalendar()}
        </div>
      </div>

      {/* Journal Section */}
      {selectedDate && getJournalForSelectedDate() && (
        <div
          style={{
            background: "#f5faff",
            borderRadius: 16,
            border: "1.5px solid #e0e3e7",
            padding: "18px 18px 12px 18px",
            margin: "0 auto 0 auto",
            marginBottom: 0,
            maxWidth: 420,
            boxShadow: "0 2px 8px rgba(56,182,255,0.06)",
          }}
        >
          <h3
            className="text-lg font-bold text-foreground mb-4"
            style={{
              fontSize: 18,
              color: "#2563eb",
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: "0.01em",
              textAlign: "center",
            }}
          >
            My Journal on {selectedDate} {selectedMonth} {selectedYear}
          </h3>
          <div className="space-y-3">
            {getJournalForSelectedDate().map((entry, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1.5px solid #e0e3e7",
                  padding: "14px 16px",
                  marginBottom: 10,
                  fontSize: 15,
                  color: "#374151",
                  fontFamily: "'Canva Sans', sans-serif",
                  boxShadow: "0 1px 4px rgba(56,182,255,0.04)",
                }}
              >
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{
                    margin: 0,
                    fontSize: 15,
                    color: "#374151",
                    lineHeight: 1.7,
                  }}
                >
                  "{entry}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
