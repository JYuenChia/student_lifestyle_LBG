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
    calendarCells.push(<div key={`empty-${i}`} className="w-10 h-10" />);
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
        className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer text-sm
          ${isNextPeriod ? "bg-red-300 text-white" : ""}
          ${isFertile ? "bg-green-200" : ""}
          ${hasMood ? "border-2 border-blue-400" : "border border-gray-200"}
        `}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="p-6">
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
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{calendarCells}</div>
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
