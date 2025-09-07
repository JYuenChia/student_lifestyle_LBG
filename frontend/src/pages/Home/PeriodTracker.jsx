// PeriodTracker.jsx
import React, { useState, useMemo } from "react";

// Add originalMoodData to props if you need to use the scale or other info
export default function PeriodTracker({ moodData, originalMoodData /*, ...otherProps */ }) {
  const cycleLength = 28;
  const lastPeriodDate = "2025-09-01";
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  // Helpers
  function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Calculate predictions
  const { fertileDays, nextPeriod } = useMemo(() => {
    const start = new Date(lastPeriodDate);
    const fertile = [];
    for (let i = 10; i <= 16; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      fertile.push(formatDate(d));
    }
    const next = new Date(start);
    next.setDate(start.getDate() + cycleLength);
    return { fertileDays: fertile, nextPeriod: formatDate(next) };
  }, [cycleLength, lastPeriodDate]);

  // Generate month calendar
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(
      <div 
        key={`empty-${i}`} 
        style={{
          aspectRatio: "1",
          minWidth: 0,
          background: "transparent"
        }}
      />
    );
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(new Date(currentYear, currentMonth, d));
    const isFertile = fertileDays.includes(dateStr);
    const isNextPeriod = dateStr === nextPeriod;
    const hasMood = moodData[dateStr];

    calendarCells.push(
      <div
        key={d}
        onClick={() => setSelectedDate(dateStr)}
        style={{
          aspectRatio: "1",
          minWidth: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          background: isNextPeriod ? "#fca5a5" : isFertile ? "#bbf7d0" : "#fff",
          color: isNextPeriod ? "#fff" : "#374151",
          border: hasMood ? "2px solid #3b82f6" : "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 4px 12px rgba(56,182,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        }}
      >
        {d}
      </div>
    );
  }

  return (
    <div 
      style={{
        padding: 16,
        maxWidth: "100%",
        margin: "0 auto",
        fontFamily: "'Canva Sans', sans-serif",
        overflow: "hidden"
      }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4">Period Tracker</h2>

      {/* Prediction Overview */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
          <h4 className="font-semibold text-pink-600">Next Period</h4>
          <p className="text-lg font-bold">{nextPeriod}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <h4 className="font-semibold text-green-600">Fertile Window</h4>
          <p className="text-sm">{fertileDays[0]} – {fertileDays[fertileDays.length - 1]}</p>
        </div>
      </div>

      {/* Calendar */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 16,
          margin: "16px 0",
          boxShadow: "0 4px 20px rgba(56,182,255,0.08)",
          maxWidth: "100%",
          overflow: "hidden"
        }}
      >
        {/* Day headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 12,
          textAlign: "center"
        }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div 
              key={day}
              style={{
                minWidth: 0,
                height: 24,
                borderRadius: 6,
                background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                boxShadow: "0 1px 4px rgba(100,116,139,0.15)"
              }}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3
        }}>
          {calendarCells}
        </div>
      </div>

      {/* Selected Day Info */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-white rounded-xl border shadow-sm">
          <h4 className="font-semibold">Details for {selectedDate}</h4>
          {moodData[selectedDate] ? (
            <p className="mt-2">Mood: {moodData[selectedDate]}</p>
          ) : (
            <p className="mt-2 text-muted-foreground">No mood entry for this day.</p>
          )}

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Symptoms/Notes</label>
            <textarea
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Cramps, fatigue, cravings..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
