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
    if (typeof mood === "string" && moodEmojis[mood]) {
      return (
        <img
          src={`emojis/${mood}.png`} // Use relative path for Vite preview/prod
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
    <div className="p-6 bg-card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Calendar</h2>

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
            marginBottom: "12px",
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
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
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
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">
            My Journal on {selectedDate} {selectedMonth} {selectedYear}...
          </h3>
          <div className="space-y-3">
            {getJournalForSelectedDate().map((entry, index) => (
              <div key={index} className="bg-muted rounded-lg p-3 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">"{entry}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
