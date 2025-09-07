// PeriodTracker.jsx
import React, { useState, useMemo } from "react";
import MoodCycleChart from "./MoodCycleChart";
import { scaleToEmoji } from "./moodScale";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const PHASES = [
  { name: "Menstrual", emoji: "🩸", start: 0, end: 4 },
  { name: "Follicular", emoji: "🌱", start: 5, end: 13 },
  { name: "Ovulation", emoji: "🥚", start: 14, end: 16 },
  { name: "Luteal", emoji: "🌙", start: 17, end: 27 },
];

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str || "null") ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function toISO(year, monthIndex, day) {
  // monthIndex is 0-based
  const d = new Date(year, monthIndex, day);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatHuman(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function PeriodTracker() {
  const today = new Date();

  // ===== State / persisted stores =====
  const [lastPeriodDate, setLastPeriodDate] = useState(
    localStorage.getItem("period_lastDate") || "2025-09-01"
  );
  const [cycleLength, setCycleLength] = useState(
    Number(localStorage.getItem("period_cycleLength")) || 28
  );
  const [symptoms, setSymptoms] = useState(
    safeJsonParse(localStorage.getItem("period_symptoms"), {})
  );
  // moodData contains both phase moods (keys like "Menstrual") and daily entries keyed by ISO date "YYYY-MM-DD".
  const [moodData, setMoodData] = useState(
    safeJsonParse(localStorage.getItem("period_moodData"), {})
  );
  const [notes, setNotes] = useState(
    safeJsonParse(localStorage.getItem("period_notes"), {})
  );

  const [selectedDate, setSelectedDate] = useState(null); // ISO date string when selected
  const [editMode, setEditMode] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // month / year picker
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const thisYear = today.getFullYear();
  const years = [];
  for (let y = thisYear - 2; y <= thisYear + 2; y++) years.push(y);

  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(thisYear);

  // ===== Cycle calculations =====
  const daysSinceLast = useMemo(() => {
    // local-time day diff; can swap to UTC if you need timezone-safe math
    const diff = (today - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  }, [lastPeriodDate, today]);

  const currentPhase = useMemo(() => {
    const day = ((daysSinceLast % cycleLength) + cycleLength) % cycleLength;
    return PHASES.find((p) => day >= p.start && day <= p.end) || PHASES[0];
  }, [daysSinceLast, cycleLength]);

  const { fertileDays, nextPeriod } = useMemo(() => {
    const start = new Date(lastPeriodDate);
    const fertile = [];
    for (let i = 14; i <= 16; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      fertile.push(formatHuman(d));
    }
    const next = new Date(start);
    next.setDate(start.getDate() + cycleLength);
    return { fertileDays: fertile, nextPeriod: formatHuman(next) };
  }, [cycleLength, lastPeriodDate]);

  // ===== Persistence handlers =====
  const handleSaveAll = () => {
    localStorage.setItem("period_lastDate", lastPeriodDate);
    localStorage.setItem("period_cycleLength", String(cycleLength));
    localStorage.setItem("period_symptoms", JSON.stringify(symptoms));
    localStorage.setItem("period_moodData", JSON.stringify(moodData));
    localStorage.setItem("period_notes", JSON.stringify(notes));
    alert("Data saved!");
  };

  // Save current selected day edits
  function saveSelectedDay() {
    if (!selectedDate) return;
    // Ensure values are numbers & clamped
    const dailyMood = moodData[selectedDate];
    if (dailyMood !== undefined) {
      const clamped = Math.max(0, Math.min(4, Number(dailyMood) || 0));
      setMoodData(prev => {
        const next = { ...prev, [selectedDate]: clamped };
        localStorage.setItem("period_moodData", JSON.stringify(next));
        return next;
      });
    }
    // notes already stored in state — write to localStorage
    setNotes(prev => {
      localStorage.setItem("period_notes", JSON.stringify(prev));
      return prev;
    });
    setEditMode(false);
  }

  // ===== Calendar helpers =====
  const currentMonthIndex = months.indexOf(selectedMonth);
  const currentYear = Number(selectedYear);
  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();

  function renderCalendar() {
    const cells = [];
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDay + 1;
      if (i < firstDay || day > daysInMonth) {
        cells.push(
          <div
            key={`empty-${i}`}
            style={{
              width: 44, height: 44, minWidth: 44, minHeight: 44,
              background: "#f5f6f7", borderRadius: 10, border: "1px solid #e0e3e7"
            }}
          />
        );
      } else {
        const iso = toISO(currentYear, currentMonthIndex, day); // ISO key for that cell
        const human = formatHuman(new Date(currentYear, currentMonthIndex, day));
        const moodVal = (() => {
          const v = moodData[iso];
          return Number.isFinite(Number(v)) ? Number(v) : null;
        })();

        const isSelected = selectedDate === iso;
        const showEmoji = moodVal !== null ? (scaleToEmoji[moodVal] || "") : "";

        cells.push(
          <button
            key={iso}
            onClick={() => { setSelectedDate(iso); setEditMode(false); }}
            aria-pressed={isSelected}
            title={human}
            style={{
              width: 44, height: 44, minWidth: 44, minHeight: 44,
              background: "#fff",
              borderRadius: 10,
              border: isSelected ? "2.5px solid #38b6ff" : "1.5px solid #e0e3e7",
              position: "relative",
              boxShadow: "0 1px 4px rgba(56,182,255,0.04)",
              cursor: "pointer"
            }}
          >
            <span style={{ position: "absolute", top: 6, left: 8, fontSize: 11, fontWeight: 600 }}>{day}</span>
            {showEmoji && (
              <span style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)", fontSize: 18, lineHeight: 1
              }}>
                {showEmoji}
              </span>
            )}
          </button>
        );
      }
    }
    return cells;
  }

  // selected day derived key and values
  const selectedDateKey = selectedDate;
  const selectedDayMood = selectedDateKey ? (moodData[selectedDateKey] ?? "") : "";
  const selectedDayNote = selectedDateKey ? (notes[selectedDateKey] ?? "") : "";

  // ===== UI =====
  return (
    <div
      className="p-6"
      style={{
        maxWidth: 540,
        margin: "0 auto",
        fontFamily: "'Canva Sans', sans-serif",
        fontSize: 16,
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#e11d48",
          marginBottom: 16,
          letterSpacing: "0.01em",
        }}
      >
        Period Tracker
      </h2>

      {/* Inputs */}
      <div
        className="bg-[#fff0f6] p-4 rounded-xl border border-pink-200 mb-6"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Last Period Start Date</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 text-sm"
              value={lastPeriodDate}
              onChange={e => setLastPeriodDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cycle Length (days)</label>
            <input
              type="number"
              min={21}
              max={35}
              className="w-full border rounded-lg p-2 text-sm"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Mood by phase */}
      <div
        className="bg-[#f0f9ff] p-4 rounded-xl border border-blue-200 mb-6"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <h4 className="font-semibold mb-2 text-blue-700" style={{ letterSpacing: "0.01em" }}>Mood by Phase</h4>
        {PHASES.map(phase => {
          const val = moodData[phase.name];
          const phaseVal = Number.isFinite(Number(val)) ? Number(val) : 1;
          return (
            <div key={phase.name} className="flex items-center mb-2" style={{ margin: "10px 0", gap: 14 }}>
              <span className="w-24 text-sm">{phase.emoji} {phase.name}</span>
              <input
                type="range"
                min={1}
                max={4}
                value={phaseVal}
                onChange={e => {
                  const v = Math.max(1, Math.min(4, Number(e.target.value)));
                  setMoodData(prev => {
                    const next = { ...prev, [phase.name]: v };
                    localStorage.setItem("period_moodData", JSON.stringify(next));
                    return next;
                  });
                }}
                className="mx-2 flex-1"
              />
              <span className="w-6 text-center text-sm">{phaseVal}</span>
              <span className="ml-2 text-xl">{scaleToEmoji[phaseVal] || ""}</span>
            </div>
          );
        })}
      </div>

      {/* Current phase */}
      <div
        className="bg-[#f3f4f6] border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-4"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <div>
          <div className="font-semibold mb-1 text-gray-500 text-sm">Current Phase</div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">{currentPhase.emoji}</span>
            <div>
              <div className="font-semibold text-[#e11d48] text-base">{currentPhase.name} phase</div>
              <div className="mt-1 text-sm">
                Mood insight: <span className="font-bold">{moodData[currentPhase.name] ?? "N/A"}</span>
                <span className="ml-2 text-xl">{scaleToEmoji[moodData[currentPhase.name]] || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="mb-6 grid grid-cols-2 gap-4" style={{ margin: "16px 0" }}>
        <div
          className="p-4 bg-pink-50 rounded-xl border border-pink-200 flex flex-col items-center justify-center"
          style={{ margin: "8px", fontSize: 15 }}
        >
          <h4 className="font-semibold text-pink-600 text-base mb-1">Next Period</h4>
          <p className="text-lg font-bold text-pink-600">{nextPeriod}</p>
        </div>
        <div
          className="p-4 bg-green-50 rounded-xl border border-green-200 flex flex-col items-center justify-center"
          style={{ margin: "8px", fontSize: 15 }}
        >
          <h4 className="font-semibold text-green-600 text-base mb-1">Fertile Window</h4>
          <p className="text-base text-green-700">{fertileDays[0]} – {fertileDays[fertileDays.length - 1]}</p>
        </div>
      </div>

      {/* Month/Year select */}
      <div
        className="flex items-center bg-[#f5f6f7] rounded-xl px-5 h-12 mb-3 shadow border border-gray-200 gap-3"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-3 py-2 rounded-lg">
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="px-3 py-2 rounded-lg">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Calendar */}
      <div
        className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 mb-6"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} style={{ width: 44, height: 32, borderRadius: 8, background: "#f5f6f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2" style={{ padding: 8 }}>
          {renderCalendar()}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDateKey && (
        <div
          className="mt-6 bg-white border border-gray-200 rounded-3xl p-6 shadow"
          style={{
            margin: "24px 0",
            fontSize: 15,
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 4px 24px 0 rgba(56,182,255,0.08)",
            border: "1.5px solid #e0e3e7",
            position: "relative"
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{
              fontSize: 18,
              color: "#2563eb",
              fontWeight: 700,
              marginBottom: 18,
              letterSpacing: "0.01em",
              textAlign: "center"
            }}
          >
            Details for {formatHuman(new Date(selectedDateKey))}
          </h4>

          {/* Large mood emoji */}
          <div
            style={{
              width: 64,
              height: 64,
              background: "#38b6ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px auto",
              boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 38, color: "#fff" }}>
              {scaleToEmoji[moodData[selectedDateKey]] || "📝"}
            </span>
          </div>

          {/* Mood input */}
          <div style={{ marginBottom: 18 }}>
            <label className="block text-base font-semibold mb-1" style={{ color: "#2563eb" }}>
              Mood:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number"
                min={1}
                max={4}
                value={moodData[selectedDateKey] ?? ""}
                onChange={e => {
                  const v = e.target.value === "" ? "" : Math.max(1, Math.min(4, Number(e.target.value)));
                  setMoodData(prev => {
                    const next = { ...prev, [selectedDateKey]: v };
                    return next;
                  });
                }}
                disabled={!editMode}
                className="border rounded px-2 py-1"
                style={{
                  width: 60,
                  fontSize: 16,
                  fontWeight: 600,
                  border: "1.5px solid #e0e3e7",
                  background: editMode ? "#f5f6f7" : "#f3f4f6",
                  color: "#222"
                }}
                placeholder="Enter 1-4"
              />
              <span style={{ fontSize: 28, marginLeft: 4 }}>
                {scaleToEmoji[moodData[selectedDateKey]] || ""}
              </span>
            </div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
              How did you feel today? Enter a number from 1 (lowest) to 4 (highest) and add notes below.
            </div>
          </div>

          {/* Notes textarea */}
          <div style={{ marginBottom: 18 }}>
            <label className="block text-base font-semibold mb-1" style={{ color: "#2563eb" }}>
              Symptoms / Notes
            </label>
            <textarea
              className="w-full border rounded-xl p-3 text-sm"
              placeholder="Cramps, fatigue, cravings..."
              value={notes[selectedDateKey] ?? ""}
              onChange={e => setNotes(prev => ({ ...prev, [selectedDateKey]: e.target.value }))}
              disabled={!editMode}
              style={{
                fontFamily: "'Canva Sans', sans-serif",
                fontSize: 15,
                background: editMode ? "#f5f6f7" : "#f3f4f6",
                border: "1.5px solid #e0e3e7",
                color: "#222",
                minHeight: 64,
                marginTop: 2,
                marginBottom: 0,
                resize: "vertical"
              }}
            />
          </div>

          {/* Edit/Save buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            {!editMode ? (
              <button
                className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold"
                onClick={() => setEditMode(true)}
                style={{
                  background: "#38b6ff",
                  color: "#fff",
                  fontFamily: "'Canva Sans', sans-serif",
                  fontWeight: 600,
                  border: "none",
                  fontSize: 15,
                  minWidth: 80,
                  boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
                  cursor: "pointer"
                }}
              >
                Edit
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
                onClick={saveSelectedDay}
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  fontFamily: "'Canva Sans', sans-serif",
                  fontWeight: 600,
                  border: "none",
                  fontSize: 15,
                  minWidth: 80,
                  boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <button
        className="w-full py-2 rounded-lg font-semibold mt-6 bg-blue-600 text-white"
        onClick={handleSaveAll}
        style={{
          margin: "16px 0",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.01em",
        }}
      >
        Save All
      </button>

      <button
        className="w-full py-2 rounded-lg font-semibold mt-3"
        style={{
          background: showChart ? "#e11d48" : "#38b6ff",
          color: "#fff",
          border: "none",
          marginBottom: 0,
          transition: "background 0.15s",
          margin: "16px 0",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.01em",
        }}
        onClick={() => setShowChart(v => !v)}
      >
        {showChart ? "Hide Mood vs Cycle Chart" : "Show Mood vs Cycle Chart"}
      </button>

      {showChart && (
        <MoodCycleChart
          moodData={moodData}
          periodData={{ lastPeriod: lastPeriodDate, cycleLength }}
        />
      )}
    </div>
  );
}

