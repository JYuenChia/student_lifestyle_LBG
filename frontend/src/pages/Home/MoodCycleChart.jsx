// MoodCycleChart.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const PHASES = [
  { name: "Menstrual", emoji: "🩸" },
  { name: "Follicular", emoji: "🌱" },
  { name: "Ovulation", emoji: "🥚" },
  { name: "Luteal", emoji: "🌙" },
];

// Gradient color stops for mood scale (1-4)
const moodGradient = [
  "#f87171", // 1 - red
  "#fbbf24", // 2 - yellow
  "#38b6ff", // 3 - blue
  "#22c55e", // 4 - green
];

// Simple color interpolation helper (used only to color the bar)
function getMoodGradient(val) {
  // val expected between 1 and 4 (can be float)
  if (!isFinite(val)) return moodGradient[1];
  val = Math.max(1, Math.min(4, val));
  if (val <= 1) return moodGradient[0];
  if (val >= 4) return moodGradient[3];

  const idx = Math.floor(val) - 1;
  const frac = val - Math.floor(val);

  const hexToRgb = (hex) =>
    hex.replace("#", "").match(/.{1,2}/g).map((x) => parseInt(x, 16));
  const rgbToHex = (rgb) =>
    "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

  const rgb1 = hexToRgb(moodGradient[idx]);
  const rgb2 = hexToRgb(moodGradient[idx + 1]);
  const rgb = rgb1.map((c, i) => Math.round(c + (rgb2[i] - c) * frac));
  return rgbToHex(rgb);
}

// Render a horizontal segmented bar for mood value (1–4)
function MoodBar({ value }) {
  const total = 4;
  const clamped = Math.max(1, Math.min(total, Number(value) || 1));
  const filled = Math.round(clamped);
  const color = getMoodGradient(clamped || 2);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 18,
        width: 96,
        marginRight: 12,
        gap: 6,
      }}
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 6,
            background: i < filled ? color : "#fff",
            border: `1.25px solid ${color}`,
            boxSizing: "border-box",
            transition: "background 0.15s, border-color 0.15s",
          }}
        />
      ))}
    </div>
  );
}

// Mood scale details (1-4)
const moodScaleDetails = {
  1: {
    label: "Very Low Mood",
    emoji: "😢",
    desc: (
      <>
        <div><b>Emotions:</b> irritable, sad, anxious, low motivation</div>
        <div><b>Physical:</b> cramps, fatigue, cravings</div>
        <div><b>Phase:</b> often during late luteal (PMS) or first 1–2 days of menstruation</div>
      </>
    ),
  },
  2: {
    label: "Low Mood",
    emoji: "😖",
    desc: (
      <>
        <div><b>Emotions:</b> slightly down, more sensitive than usual</div>
        <div><b>Physical:</b> mild discomfort, energy dips</div>
        <div><b>Phase:</b> menstruation or pre-menstrual</div>
      </>
    ),
  },
  3: {
    label: "Positive Mood",
    emoji: "😊",
    desc: (
      <>
        <div><b>Emotions:</b> motivated, social, confident</div>
        <div><b>Physical:</b> good energy, minimal symptoms</div>
        <div><b>Phase:</b> mid-follicular to pre-ovulation</div>
      </>
    ),
  },
  4: {
    label: "Very Positive Mood",
    emoji: "❤️",
    desc: (
      <>
        <div><b>Emotions:</b> happiest, energetic, creative, flirty/playful</div>
        <div><b>Physical:</b> peak energy, body feels light</div>
        <div><b>Phase:</b> ovulation</div>
      </>
    ),
  },
};

export default function MoodCycleChart({ moodData: propMoodData }) {
  const location = useLocation();
  const state = location.state || {};

  const lastPeriodDate =
    (state.lastPeriodDate) ||
    localStorage.getItem("period_lastDate") ||
    "2025-09-01";
  const cycleLength =
    (state.cycleLength) ||
    Number(localStorage.getItem("period_cycleLength")) ||
    28;

  // prefer explicit prop, else state, else localStorage
  const moodData =
    propMoodData && Object.keys(propMoodData).length > 0
      ? propMoodData
      : state.moodData && Object.keys(state.moodData).length > 0
      ? state.moodData
      : (JSON.parse(localStorage.getItem("period_moodData") || "{}") || {});

  // Days until next period (0 means expected today)
  const today = new Date();
  const last = new Date(lastPeriodDate);
  const daysSinceLast = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  const remainder = ((daysSinceLast % cycleLength) + cycleLength) % cycleLength;
  const daysUntilNext = remainder === 0 ? 0 : cycleLength - remainder;

  // Test notification (requests permission and only creates a notification if granted)
  function testNotify() {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        try {
          new Notification("Test Reminder", {
            body: "This is a test notification.",
          });
        } catch (err) {
          // some browsers require service worker for persistent notifications
          console.warn("Failed to create notification:", err);
          alert("Permission granted but creating a Notification failed (browser restrictions).");
        }
      } else {
        alert("Notification permission not granted.");
      }
    });
  }

  // Mood phase insights: find min/max including valid 0 values
  function getPhaseInsight(moodMap) {
    let minVal = Infinity,
      maxVal = -Infinity,
      minPhase = null,
      maxPhase = null;

    PHASES.forEach((phase) => {
      const raw = moodMap && moodMap[phase.name];
      const val = raw === undefined || raw === null ? NaN : Number(raw);
      if (!Number.isFinite(val)) return;
      if (val < minVal) {
        minVal = val;
        minPhase = phase;
      }
      if (val > maxVal) {
        maxVal = val;
        maxPhase = phase;
      }
    });

    const parts = [];
    if (minPhase) {
      parts.push(`You often feel lowest during the ${minPhase.name.toLowerCase()} phase (avg ${minVal}).`);
    }
    if (maxPhase) {
      parts.push(`Your best mood scores appear around ${maxPhase.name.toLowerCase()} (avg ${maxVal}).`);
    }
    if (!parts.length) return "No mood phase data available yet.";
    return parts.join(" ");
  }

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
          color: "#2563eb",
          marginBottom: 16,
          letterSpacing: "0.01em",
        }}
      >
        Mood vs Cycle Phase
      </h2>

      {/* Info Cards */}
      <div
        className="flex flex-wrap"
        style={{ gap: "32px", marginBottom: 32, marginTop: 16, fontSize: 15 }}
      >
        <div
          className="bg-[#f0f9ff] p-4 rounded-xl border border-blue-200 min-w-[140px] flex-1 flex flex-col items-center justify-center text-center shadow"
          style={{ margin: "12px" }}
        >
          <div className="mb-2 text-sm text-[#2563eb] font-bold" style={{ letterSpacing: "0.01em" }}>Last Period</div>
          <div className="font-bold text-[#2563eb] text-lg" style={{ letterSpacing: "0.01em" }}>{lastPeriodDate}</div>
        </div>
        <div
          className="bg-[#f0fdf4] p-4 rounded-xl border border-green-200 min-w-[140px] flex-1 flex flex-col items-center justify-center text-center shadow"
          style={{ margin: "12px" }}
        >
          <div className="mb-2 text-sm text-[#16a34a] font-bold" style={{ letterSpacing: "0.01em" }}>Cycle Length</div>
          <div className="font-bold text-[#16a34a] text-lg" style={{ letterSpacing: "0.01em" }}>{cycleLength} days</div>
        </div>
        <div
          className="bg-[#fef9c3] p-4 rounded-xl border border-yellow-200 min-w-[180px] flex-2 flex flex-col items-center justify-center text-center shadow"
          style={{ margin: "12px" }}
        >
          <div className="mb-2 text-sm text-[#eab308] font-bold" style={{ letterSpacing: "0.01em" }}>Upcoming Reminder</div>
          <div className="font-bold text-[#eab308] text-lg" style={{ letterSpacing: "0.01em" }}>
            {daysUntilNext === 0 ? "Your period may start today." : `Your period is expected in ${daysUntilNext} day(s).`}
          </div>
        </div>
      </div>

      {/* Test notification button */}
      <div className="mb-8 -mt-2">
        <button
          className="w-full py-2 rounded-lg font-semibold text-base bg-[#38b6ff] text-white shadow"
          style={{
            border: "none",
            transition: "background 0.15s",
            letterSpacing: "0.01em",
            fontSize: 15,
            fontWeight: 700,
          }}
          onClick={testNotify}
        >
          Test Reminder Notification
        </button>
      </div>

      {/* Mood per Phase Card */}
      <div
        className="bg-[#f0fdf4] p-6 rounded-xl border border-green-200 mb-8 mt-2 shadow"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <h4 className="font-semibold mb-4 text-green-700" style={{ letterSpacing: "0.01em" }}>Mood per Cycle Phase</h4>
        <div>
          {PHASES.map((phase) => {
            const raw = moodData && moodData[phase.name];
            const moodVal = Number.isFinite(Number(raw)) ? Number(raw) : 1;
            const moodScale = moodScaleDetails[Math.round(moodVal)] || {};
            return (
              <div
                key={phase.name}
                className="flex items-center mb-5 min-h-[24px]"
                style={{ gap: "18px", letterSpacing: "0.01em" }}
              >
                <span className="w-24 min-w-[90px] text-sm">{phase.emoji}{" "}{phase.name}</span>
                <MoodBar value={moodVal} />
                <span className="ml-2 min-w-[18px] font-bold">{moodVal}</span>
                <span className="ml-2 text-xl">{moodScale.emoji || ""}</span>
                <span className="ml-3 text-sm text-gray-500">{moodScale.label || ""}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood Insights Card */}
      <div
        className="bg-[#f8fafc] border border-gray-200 rounded-xl p-6 mb-8 mt-2 shadow"
        style={{ margin: "16px 0", fontSize: 15 }}
      >
        <h4 className="font-semibold mb-4 text-blue-700" style={{ letterSpacing: "0.01em" }}>Mood insights by phase</h4>
        <div>
          {PHASES.map((phase) => {
            const raw = moodData && moodData[phase.name];
            const moodVal = Number.isFinite(Number(raw)) ? Number(raw) : null;
            const moodScale = moodVal !== null ? moodScaleDetails[Math.round(moodVal)] : null;
            return (
              <div
                key={phase.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "18px",
                  letterSpacing: "0.01em",
                  marginBottom: "32px",
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "24px 20px 24px 20px",
                  boxShadow: "0 4px 24px 0 rgba(56,182,255,0.08)",
                  border: "1.5px solid #e0e3e7",
                  minHeight: 120,
                  maxWidth: 420,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: "#38b6ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 18,
                    boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 44, color: "#fff", display: "block" }}>
                    {moodScale ? moodScale.emoji : "—"}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700,
                    color: "#2563eb",
                    marginBottom: 6,
                    fontSize: 17,
                    fontFamily: "'Canva Sans', sans-serif"
                  }}>
                    {phase.name}: {moodVal !== null ? `${moodVal} — ${moodScale ? moodScale.label : ""}` : "N/A"}
                  </div>
                  {moodScale && (
                    <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, fontFamily: "'Canva Sans', sans-serif" }}>
                      <div style={{ marginBottom: 8 }}>{moodScale.desc.props.children[0]}</div>
                      <div style={{ marginBottom: 8 }}>{moodScale.desc.props.children[1]}</div>
                      <div style={{ marginBottom: 0 }}>{moodScale.desc.props.children[2]}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-8 text-[#e11d48] font-semibold"
          style={{
            padding: "18px 0 0 0",
            marginTop: "32px",
            borderTop: "1px solid #e0e3e7",
            letterSpacing: "0.01em",
            lineHeight: 2,
            whiteSpace: "pre-line",
            fontSize: 16,
            textAlign: "center"
          }}
        >
          {getPhaseInsight(moodData)}
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500" style={{ letterSpacing: "0.01em", fontSize: 13 }}>
        Notifications: Period start, symptom reminder (2 days before), daily mood check-in (9 AM)
      </div>
    </div>
  );
}
