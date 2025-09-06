import React, { useEffect, useMemo, useRef, useState } from "react";
import { emojiToScale, scaleToEmoji } from "./moodScale";

/* -------------------------
   Utility / constants
   ------------------------- */
const emojiLabelToPng = {
  Happy: "emojis/Happy.png",
  Loving: "emojis/Loving.png",
  Stress: "emojis/Stress.png",
  Mad: "emojis/Mad.png",
  Sad: "emojis/Sad.png",
  Bored: "emojis/Bored.png",
  Fear: "emojis/Fear.png",
  Custom: null,
};

const emojiMapReverse = {
  "😊": "Happy",
  "❤️": "Loving",
  "😖": "Stress",
  "😡": "Mad",
  "😢": "Sad",
  "😐": "Bored",
  "😨": "Fear",
};

function getLabelFromEmoji(emoji) {
  return emojiMapReverse[emoji] || null;
}

function getEmojiSrc(emoji) {
  if (!emoji) return null;
  if (typeof emoji === "string" && emoji.startsWith("data:")) return emoji;
  const label = getLabelFromEmoji(emoji);
  return label ? emojiLabelToPng[label] : null;
}

function getMoodWord(mood) {
  const m = Math.round(mood);
  switch (m) {
    case 5: return "Ecstatic";
    case 4: return "Happy";
    case 3: return "Neutral";
    case 2: return "Low";
    case 1: return "Down";
    default: return "Unknown";
  }
}
function getDominantMood(moodArr) {
  const freq = {};
  moodArr.forEach(m => { freq[m] = (freq[m] || 0) + 1; });
  let max = 0, dom = null;
  Object.entries(freq).forEach(([k, v]) => { if (v > max) { max = v; dom = k; } });
  return dom;
}
function getAverageMood(moodArr) {
  if (!moodArr || !moodArr.length) return 0;
  return moodArr.reduce((a, b) => a + b, 0) / moodArr.length;
}

const moodColors = { 1: "#f87171", 2: "#fbbf24", 3: "#a3a3a3", 4: "#38b6ff", 5: "#22c55e" };

function calculateHappyStreaks(moods, threshold = 4) {
  let max = 0, current = 0, running = 0;
  moods.forEach((m, i) => {
    if (m >= threshold) {
      running++;
      if (running > max) max = running;
      if (i === moods.length - 1) current = running;
    } else {
      running = 0;
    }
  });
  return { max, current };
}

/* -------------------------
   Tooltip
   ------------------------- */
function Tooltip({ x, y, date, emojiChar, emojiSrc, chartWindowWidth = 384 }) {
  // Simple clamping so tooltip stays inside the overlay viewport
  const tooltipWidth = 130;
  const tooltipHeight = 80;
  let clampedX = x - tooltipWidth / 2;
  if (clampedX < 10) clampedX = 10;
  if (clampedX > chartWindowWidth - tooltipWidth - 10) clampedX = chartWindowWidth - tooltipWidth - 10;
  let clampedY = y - tooltipHeight - 18;
  if (clampedY < 12) clampedY = 12;

  return (
    <foreignObject
      x={clampedX}
      y={clampedY}
      width={tooltipWidth}
      height={tooltipHeight}
      style={{ overflow: "visible", pointerEvents: "none", zIndex: 1000 }}
    >
      <div style={{
        background: "rgba(56,182,255,0.97)",
        color: "#fff",
        borderRadius: 16,
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px solid #fff",
        minWidth: 90,
        pointerEvents: "none",
        boxShadow: "0 4px 24px 0 rgba(56,182,255,0.18)",
      }}>
        <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.95 }}>{date}</div>
        {emojiSrc ? (
          <img src={emojiSrc} alt="emoji" style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "1.5px solid #e0e3e7" }} />
        ) : (
          <div style={{ fontSize: 28 }}>{emojiChar || "?"}</div>
        )}
      </div>
    </foreignObject>
  );
}

/* -------------------------
   Random sample data generator (Jan → Sep 2025)
   ------------------------- */
const _emojiCandidates = ["😊", "❤️", "😖", "😡", "😢", "😐", "😨"];
function _randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _pad(n) { return n < 10 ? `0${n}` : `${n}`; }

function getISOWeekInfo(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return { year: tmp.getUTCFullYear(), week: weekNo };
}
function formatMonthLabel(year, monthIndex) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[monthIndex]} ${year}`;
}

function generateSampleData(startStr = "2025-01-01", endStr = "2025-09-30") {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const daily = {};
  const weeklyBuckets = {};
  const monthlyBuckets = {};

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const isoDate = `${yyyy}-${_pad(mm)}-${_pad(dd)}`;

    const emoji = _randChoice(_emojiCandidates);
    daily[isoDate] = emoji;

    const { year: wY, week: wNo } = getISOWeekInfo(d);
    const weekKey = `${wY}-W${String(wNo).padStart(2, "0")}`;
    if (!weeklyBuckets[weekKey]) weeklyBuckets[weekKey] = [];
    weeklyBuckets[weekKey].push(emojiToScale[emoji] || 3);

    const monthKey = `${yyyy}-${String(mm).padStart(2, "0")}`;
    if (!monthlyBuckets[monthKey]) monthlyBuckets[monthKey] = [];
    monthlyBuckets[monthKey].push(emoji);
  }

  const weekly = {};
  Object.entries(weeklyBuckets).forEach(([wk, arr]) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    weekly[wk] = Number(avg.toFixed(2));
  });

  const monthly = {};
  Object.entries(monthlyBuckets).forEach(([mk, emojis]) => {
    const freq = {};
    emojis.forEach(e => (freq[e] = (freq[e] || 0) + 1));
    let dom = null, max = 0;
    Object.entries(freq).forEach(([e, c]) => { if (c > max) { max = c; dom = e; } });
    const [year, month] = mk.split("-");
    const monthLabel = formatMonthLabel(Number(year), Number(month) - 1);
    monthly[monthLabel] = { mood: dom, count: emojis.length };
  });

  return { Daily: daily, Weekly: weekly, Monthly: monthly };
}

/* -------------------------
   Main component
   ------------------------- */
export default function MoodAnalysis({ moodData }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [chartView, setChartView] = useState("Daily");
  const [fadeKey, setFadeKey] = useState(0);

  // Chart sizing and layout
  const chartWindowWidth = 388; // match Mood Insights blog width
  const baseHeight = 388;       // match Mood Insights blog height
  const padding = 32;           // default padding

  // chart type states (were referenced but missing)
  const [weeklyChartType, setWeeklyChartType] = useState("bar");
  const [monthlyChartType, setMonthlyChartType] = useState("bar");

  // generate sample data (memoized so it doesn't change on every render)
  const sampleData = useMemo(() => generateSampleData("2025-01-01", "2025-09-30"), []);

  // convertedData depends on selected view
  const convertedData = useMemo(() => {
    const src = moodData || sampleData;

    if (chartView === "Daily") {
      const daily = src.Daily || sampleData.Daily;
      return Object.entries(daily)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, value]) => ({ type: "daily", label: date, mood: emojiToScale[value] || 3, emoji: value }));
    }
    if (chartView === "Weekly") {
      const weekly = src.Weekly || sampleData.Weekly;
      return Object.entries(weekly)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([week, avg]) => ({ type: "weekly", label: week, mood: Number(avg), emoji: scaleToEmoji[Math.round(Number(avg))] || null }));
    }
    // Monthly
    const monthly = src.Monthly || sampleData.Monthly;
    return Object.entries(monthly)
      .map(([monthLabel, obj]) => {
        const [monStr, yearStr] = monthLabel.split(" ");
        const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
        const sortKey = `${yearStr}-${String(months[monStr] || 0).padStart(2, "0")}`;
        return { sortKey, label: monthLabel, obj };
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ label, obj }) => ({ type: "monthly", label, mood: emojiToScale[obj.mood] || 3, emoji: obj.mood, count: obj.count || 1 }));
  }, [chartView, moodData, sampleData]);

  const latest = convertedData.length ? convertedData[convertedData.length - 1] : null;

  /* -------------------------
     Streaks & insights
     ------------------------- */
  const moodsForStreak = convertedData.map(d => d.mood);
  const { max: maxHappyStreak, current: currentHappyStreak } = calculateHappyStreaks(moodsForStreak, 4);

  let maxConsistentStreak = 0, currentConsistentStreak = 0;
  if (chartView === "Daily" && convertedData.length) {
    let run = 1;
    maxConsistentStreak = 1;
    for (let i = 1; i < convertedData.length; i++) {
      if (Math.abs(convertedData[i].mood - convertedData[i - 1].mood) <= 1) run++;
      else run = 1;
      if (run > maxConsistentStreak) maxConsistentStreak = run;
    }
    run = 1;
    for (let i = convertedData.length - 1; i > 0; i--) {
      if (Math.abs(convertedData[i].mood - convertedData[i - 1].mood) <= 1) run++;
      else break;
    }
    currentConsistentStreak = run;
  }

  // insights (same as before)...
  let bestDay = null, bestAvg = 0, worstDay = null, worstAvg = 5, volatility = 0;
  let dominantMood = null, dominantMoodCount = 0;
  let moodBalance = null, trendChange = null;

  if (chartView === "Daily" && convertedData.length) {
    const dayMap = {};
    convertedData.forEach(d => {
      const day = new Date(d.label).toLocaleDateString("en-US", { weekday: "long" });
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(d.mood);
    });
    Object.entries(dayMap).forEach(([day, moods]) => {
      const avg = getAverageMood(moods);
      if (avg > bestAvg) { bestAvg = avg; bestDay = day; }
      if (avg < worstAvg) { worstAvg = avg; worstDay = day; }
    });
    const moods = convertedData.map(d => d.mood);
    const mean = getAverageMood(moods);
    volatility = moods.length ? Math.sqrt(moods.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / moods.length) : 0;
    const moodArr = convertedData.map(d => d.emoji);
    dominantMood = getDominantMood(moodArr);
    dominantMoodCount = moodArr.filter(m => m === dominantMood).length;
    const neutralCount = moodArr.filter(m => emojiToScale[m] === 3).length;
    if (neutralCount > convertedData.length / 2) moodBalance = "neutral";
    if (convertedData.length >= 14) {
      const last7 = convertedData.slice(-7).map(d => d.mood);
      const prev7 = convertedData.slice(-14, -7).map(d => d.mood);
      const lastAvg = getAverageMood(last7);
      const prevAvg = getAverageMood(prev7);
      if (lastAvg > prevAvg) trendChange = { up: true, last: lastAvg, prev: prevAvg };
      else if (lastAvg < prevAvg) trendChange = { up: false, last: lastAvg, prev: prevAvg };
    }
  }

  let dailyInsight = null;
  if (chartView === "Daily" && convertedData.length) {
    const today = latest;
    const yesterday = convertedData.length > 1 ? convertedData[convertedData.length - 2] : null;
    const streak = currentHappyStreak;
    if (today) {
      if (today.mood >= 4) dailyInsight = `You felt ${today.emoji} ${getMoodWord(today.mood)} today — keep it up!`;
      else if (today.mood <= 2) dailyInsight = `You marked ${today.emoji} ${getMoodWord(today.mood)} today — maybe write a short journal entry or take a short break 💙.`;
      else dailyInsight = `Today was a ${getMoodWord(today.mood)} day.`;
      if (yesterday) {
        if (today.mood > yesterday.mood) dailyInsight += ` Slightly better than yesterday (${yesterday.mood} → ${today.mood}).`;
        else if (today.mood < yesterday.mood) dailyInsight += ` A bit lower than yesterday (${yesterday.mood} → ${today.mood}).`;
      }
      if (streak > 1) dailyInsight += ` You're on a ${streak}-day positive chain 🌟.`;
    }
  }

  let weeklyInsights = [];
  if (chartView === "Weekly" && convertedData.length) {
    const moods = convertedData.map(d => d.mood);
    const min = Math.min(...moods), max = Math.max(...moods);
    if (max - min <= 1) weeklyInsights.push(`This period was steady ✅ (mood range ${min.toFixed(1)}–${max.toFixed(1)}).`);
    else weeklyInsights.push(`Some ups and downs this period ⚡ (mood range ${min.toFixed(1)}–${max.toFixed(1)}).`);
    if (convertedData.length > 1) {
      const last = convertedData[convertedData.length - 1].mood;
      const prev = convertedData[convertedData.length - 2].mood;
      if (last > prev) weeklyInsights.push(`This week’s avg (${last.toFixed(1)}) is higher than last (${prev.toFixed(1)}) 📈.`);
      else if (last < prev) weeklyInsights.push(`This week’s avg (${last.toFixed(1)}) is lower than last (${prev.toFixed(1)}) 📉.`);
    }
    const allEmojis = convertedData.map(d => d.emoji).filter(Boolean);
    const dom = getDominantMood(allEmojis);
    const domCount = allEmojis.filter(e => e === dom).length;
    if (dom) weeklyInsights.push(`${dom} was the most frequent mood (${domCount} times).`);
  }

  let monthlyInsights = [];
  if (chartView === "Monthly" && convertedData.length) {
    const all = [];
    convertedData.forEach(d => { for (let i = 0; i < (d.count || 1); i++) all.push(d.mood); });
    const avgMood = getAverageMood(all);
    monthlyInsights.push(`Average mood: ${avgMood.toFixed(1)}.`);
    if (convertedData.length > 1) {
      const last = convertedData[convertedData.length - 1].mood;
      const prev = convertedData[convertedData.length - 2].mood;
      if (last > prev) monthlyInsights.push("This month had slightly higher moods than previous month.");
      else if (last < prev) monthlyInsights.push("This month was a bit lower than previous month.");
    }
    const dom = getDominantMood(convertedData.map(d => d.emoji));
    const domCount = convertedData.reduce((acc, d) => acc + ((d.emoji === dom) ? (d.count || 1) : 0), 0);
    if (dom) monthlyInsights.push(`${dom} was dominant (${domCount} days).`);
    monthlyInsights.push(`Longest happy chain: ${maxHappyStreak} days 🌞.`);
  }

  /* -------------------------
     Chart sizing, scroll & dragging (fixed)
     ------------------------- */
  const chartWindow = chartWindowWidth;

  // small Y axis labels constant used by AxisOverlay
  const yAxisLabels = [
    { value: 5, label: "Ecstatic" },
    { value: 4, label: "Happy" },
    { value: 3, label: "Neutral" },
    { value: 2, label: "Low" },
    { value: 1, label: "Down" },
  ];

  // Compute a left label width based on the longest y label (approximation)
  const longestLabelChars = Math.max(...yAxisLabels.map(l => l.label.length));
  const approxCharWidth = 7;
  // Make y axis closer to label: reduce leftLabelWidth and plotPadding
  const leftLabelWidth = Math.max(0, longestLabelChars * approxCharWidth); // was +2, now -6 for closer
  const plotPadding = padding + leftLabelWidth; // was -10, now -26 for even closer

  // compute a total chart width based on number of points (so we can scroll if many)
  const chartTotalWidth = useMemo(() => {
    // Make chart longer but not wider than blog container
    const minWidth = Math.max(chartWindowWidth, 700);
    const points = Math.max(1, convertedData.length);
    // Increase gap for more readable chart, 5 values visible at once
    const contentWidth = plotPadding * 2 + Math.max(0, (points - 1)) * ((chartWindowWidth - plotPadding * 2) / 4);
    return Math.max(minWidth, contentWidth);
  }, [convertedData.length, chartWindowWidth, plotPadding]);

  // point gap computed from total width so items are evenly spread
  const pointGap = useMemo(() => {
    const points = Math.max(1, convertedData.length);
    return points > 1 ? (chartTotalWidth - plotPadding * 2) / (points - 1) : 0;
  }, [chartTotalWidth, convertedData.length, plotPadding]);

  // Added missing state refs
  const chartContainerRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startScroll: 0 });

  // Reset scroll on tab change
  useEffect(() => { setScrollX(0); }, [chartView, fadeKey]);

  // Drag-to-scroll logic
  useEffect(() => {
    function onMove(e) {
      if (!dragging) return;
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const dx = clientX - dragRef.current.startX;
      const max = Math.max(0, chartTotalWidth - chartWindowWidth);
      setScrollX(Math.min(Math.max(0, dragRef.current.startScroll - dx), max));
      e.preventDefault && e.preventDefault();
    }
    function onUp() {
      if (!dragging) return;
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    }
    if (dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, chartTotalWidth, chartWindowWidth]);

  function handleChartPointerDown(e) {
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    dragRef.current = { startX: clientX, startScroll: scrollX };
    setDragging(true);
    e.preventDefault && e.preventDefault();
  }

  // --- Chart Content Layer (moving) ---
  const chartContentSvg = useMemo(() => {
    const width = chartTotalWidth;
    const height = baseHeight;

    // --- Daily ---
    if (chartView === "Daily") {
      const xStep = pointGap;
      const yScale = (mood) => height - plotPadding - ((mood - 1) / 4) * (height - 2 * plotPadding);
      const pathD = convertedData.map((d, i) => {
        const x = plotPadding + i * xStep;
        const y = yScale(d.mood);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      }).join(" ");

      return (
        <svg width={width} height={height + 60} style={{ overflow: "visible", borderRadius: 18, position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="blue-gradient" x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38b6ff" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d={pathD} fill="none" stroke="url(#blue-gradient)" strokeWidth="4" style={{ filter: "drop-shadow(0 2px 8px #38b6ff33)" }} />
          {convertedData.map((d, i) => {
            const x = plotPadding + i * xStep;
            const y = yScale(d.mood);
            const emojiSrc = getEmojiSrc(d.emoji);
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(i)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  fill="#fff"
                  stroke={moodColors[d.mood] || "#38b6ff"}
                  strokeWidth="3"
                  style={{
                    filter: hoveredIndex === i ? "drop-shadow(0 2px 8px #38b6ff66)" : "none",
                    transition: "filter 0.15s",
                  }}
                />
                {hoveredIndex === i && (
                  emojiSrc
                    ? <image href={emojiSrc} x={x - 14} y={y - 38} width={28} height={28} style={{ pointerEvents: "none" }} />
                    : <text x={x - 8} y={y - 14} fontSize="20">{d.emoji}</text>
                )}
              </g>
            );
          })}
        </svg>
      );
    }

    // --- Weekly ---
    if (chartView === "Weekly") {
      const data = convertedData;
      const barW = 32;
      const gap = 18;
      const chartW = Math.max(chartWindowWidth, plotPadding * 2 + data.length * (barW + gap));
      if (weeklyChartType === "bar") {
        // Bar chart
        return (
          <svg width={chartW} height={baseHeight + 60} style={{ overflow: "visible", borderRadius: 18, position: "absolute", left: 0, top: 0 }}>
            {data.map((d, i) => {
              const x = plotPadding + i * (barW + gap);
              const barHeight = ((d.mood - 1) / 4) * (baseHeight - 2 * plotPadding);
              const rounded = Math.max(1, Math.min(5, Math.round(d.mood || 3)));
              const emojiSrc = getEmojiSrc(d.emoji);
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(i)}
                  style={{ cursor: "pointer" }}
                >
                  {hoveredIndex === i && (
                    emojiSrc
                      ? <image href={emojiSrc} x={x + barW / 2 - 10} y={baseHeight - plotPadding - barHeight - 32} width={20} height={20} />
                      : <text x={x + barW / 2 - 6} y={baseHeight - plotPadding - barHeight - 16} fontSize="14">{d.emoji}</text>
                  )}
                  <rect
                    x={x}
                    y={baseHeight - plotPadding - barHeight}
                    width={barW}
                    height={barHeight}
                    fill={moodColors[rounded]}
                    rx={8}
                    style={{ filter: "drop-shadow(0 2px 8px #00000022)" }}
                  />
                  <text
                    x={x + barW / 2}
                    y={baseHeight - plotPadding - barHeight - 8}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#2563eb"
                    fontWeight="bold"
                  >
                    {d.mood.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      } else {
        // Line chart
        const xStep = (chartW - plotPadding * 2) / Math.max(1, data.length - 1);
        const yScale = (mood) => baseHeight - plotPadding - ((mood - 1) / 4) * (baseHeight - 2 * plotPadding);
        const pathD = data.map((d, i) => {
          const x = plotPadding + i * xStep;
          const y = yScale(d.mood);
          return `${i === 0 ? "M" : "L"}${x},${y}`;
        }).join(" ");
        return (
          <svg width={chartW} height={baseHeight + 60} style={{ overflow: "visible", borderRadius: 18, position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="weekly-blue-gradient" x1="0" y1="0" x2={chartW} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38b6ff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d={pathD} fill="none" stroke="url(#weekly-blue-gradient)" strokeWidth="4" style={{ filter: "drop-shadow(0 2px 8px #38b6ff33)" }} />
            {data.map((d, i) => {
              const x = plotPadding + i * xStep;
              const y = yScale(d.mood);
              const emojiSrc = getEmojiSrc(d.emoji);
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(i)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={7}
                    fill="#fff"
                    stroke={moodColors[Math.round(d.mood)] || "#38b6ff"}
                    strokeWidth="3"
                    style={{
                      filter: hoveredIndex === i ? "drop-shadow(0 2px 8px #38b6ff66)" : "none",
                      transition: "filter 0.15s",
                    }}
                  />
                  {hoveredIndex === i && (
                    emojiSrc
                      ? <image href={emojiSrc} x={x - 14} y={y - 38} width={28} height={28} style={{ pointerEvents: "none" }} />
                      : <text x={x - 8} y={y - 14} fontSize="20">{d.emoji}</text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }
    }

    // --- Monthly ---
    if (chartView === "Monthly") {
      const data = convertedData;
      const barW = 32;
      const gap = 18;
      const chartW = Math.max(chartWindowWidth, plotPadding * 2 + data.length * (barW + gap));
      if (monthlyChartType === "bar") {
        // Bar chart
        return (
          <svg width={chartW} height={baseHeight + 60} style={{ overflow: "visible", borderRadius: 18, position: "absolute", left: 0, top: 0 }}>
            {data.map((d, i) => {
              const x = plotPadding + i * (barW + gap);
              const barHeight = ((d.mood - 1) / 4) * (baseHeight - 2 * plotPadding);
              const rounded = Math.max(1, Math.min(5, Math.round(d.mood || 3)));
              const emojiSrc = getEmojiSrc(d.emoji);
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(i)}
                  style={{ cursor: "pointer" }}
                >
                  {hoveredIndex === i && (
                    emojiSrc
                      ? <image href={emojiSrc} x={x + barW / 2 - 10} y={baseHeight - plotPadding - barHeight - 32} width={20} height={20} />
                      : <text x={x + barW / 2 - 6} y={baseHeight - plotPadding - barHeight - 16} fontSize="14">{d.emoji}</text>
                  )}
                  <rect
                    x={x}
                    y={baseHeight - plotPadding - barHeight}
                    width={barW}
                    height={barHeight}
                    fill={moodColors[rounded]}
                    rx={8}
                    style={{ filter: "drop-shadow(0 2px 8px #00000022)" }}
                  />
                  <text
                    x={x + barW / 2}
                    y={baseHeight - plotPadding - barHeight - 8}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#2563eb"
                    fontWeight="bold"
                  >
                    {d.mood.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      } else {
        // Line chart
        const xStep = (chartW - plotPadding * 2) / Math.max(1, data.length - 1);
        const yScale = (mood) => baseHeight - plotPadding - ((mood - 1) / 4) * (baseHeight - 2 * plotPadding);
        const pathD = data.map((d, i) => {
          const x = plotPadding + i * xStep;
          const y = yScale(d.mood);
          return `${i === 0 ? "M" : "L"}${x},${y}`;
        }).join(" ");
        return (
          <svg width={chartW} height={baseHeight + 60} style={{ overflow: "visible", borderRadius: 18, position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="monthly-blue-gradient" x1="0" y1="0" x2={chartW} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38b6ff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d={pathD} fill="none" stroke="url(#monthly-blue-gradient)" strokeWidth="4" style={{ filter: "drop-shadow(0 2px 8px #38b6ff33)" }} />
            {data.map((d, i) => {
              const x = plotPadding + i * xStep;
              const y = yScale(d.mood);
              const emojiSrc = getEmojiSrc(d.emoji);
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(i)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={7}
                    fill="#fff"
                    stroke={moodColors[Math.round(d.mood)] || "#38b6ff"}
                    strokeWidth="3"
                    style={{
                      filter: hoveredIndex === i ? "drop-shadow(0 2px 8px #38b6ff66)" : "none",
                      transition: "filter 0.15s",
                    }}
                  />
                  {hoveredIndex === i && (
                    emojiSrc
                      ? <image href={emojiSrc} x={x - 14} y={y - 38} width={28} height={28} style={{ pointerEvents: "none" }} />
                      : <text x={x - 8} y={y - 14} fontSize="20">{d.emoji}</text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }
    }

    return null;
  }, [chartView, convertedData, hoveredIndex, chartTotalWidth, pointGap, chartWindowWidth, weeklyChartType, monthlyChartType, plotPadding]);

  // --- Axis Overlay Layer (fixed) ---
  function AxisOverlay() {
    const width = chartWindowWidth;
    const height = baseHeight;
    const axisPadding = plotPadding;

    const yLabelsGroup = yAxisLabels.map(({ value, label }) => {
      const y = height - axisPadding - ((value - 1) / 4) * (height - 2 * axisPadding);
      return (
        <g key={value}>
          <text
            x={axisPadding - leftLabelWidth + 2} // was -2, now +2 for tight alignment
            y={y + 5} // was +4, now +5 for vertical centering
            textAnchor="end"
            fontSize="15"
            fill="#888"
            style={{ userSelect: "none" }}
          >
            {label}
          </text>
          <line
            x1={axisPadding}
            y1={y}
            x2={width - axisPadding}
            y2={y}
            stroke="#e0e3e7"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity={0.3}
          />
        </g>
      );
    });

    let xLabels = [];
    if (chartView === "Daily") {
      const xStep = pointGap;
      // Show 5 x-axis labels (first, last, and 3 evenly spaced)
      const n = convertedData.length;
      const labelIndexes = [0];
      if (n > 1) {
        labelIndexes.push(Math.floor((n - 1) / 4));
        labelIndexes.push(Math.floor((n - 1) / 2));
        labelIndexes.push(Math.floor(3 * (n - 1) / 4));
        labelIndexes.push(n - 1);
      }
      for (let i = 0; i < convertedData.length; i++) {
        if (!labelIndexes.includes(i)) continue;
        const absoluteX = plotPadding + i * xStep;
        const viewportX = absoluteX - scrollX;
        if (viewportX >= axisPadding && viewportX <= width - axisPadding) {
          xLabels.push(
            <text key={i} x={Math.round(viewportX)} y={height - axisPadding + 32} textAnchor="middle" fontSize="13" fill="#888" style={{ userSelect: "none" }}>
              {convertedData[i].label.slice(5)}
            </text>
          );
        }
      }
    } else {
      const barW = 32, gap = 18;
      const n = convertedData.length;
      const labelIndexes = [0];
      if (n > 1) {
        labelIndexes.push(Math.floor((n - 1) / 4));
        labelIndexes.push(Math.floor((n - 1) / 2));
        labelIndexes.push(Math.floor(3 * (n - 1) / 4));
        labelIndexes.push(n - 1);
      }
      for (let i = 0; i < convertedData.length; i++) {
        if (!labelIndexes.includes(i)) continue;
        const absoluteX = plotPadding + i * (barW + gap) + barW / 2;
        const viewportX = absoluteX - scrollX;
        if (viewportX >= axisPadding && viewportX <= width - axisPadding) {
          xLabels.push(
            <text key={i} x={Math.round(viewportX)} y={height - axisPadding + 32} textAnchor="middle" fontSize="13" fill="#888" style={{ userSelect: "none" }}>
              {chartView === "Weekly" ? `W${convertedData[i].label.split("-W")[1]}` : convertedData[i].label.split(" ")[0]}
            </text>
          );
        }
      }
    }

    const xAxisTitle = chartView === "Weekly" ? "Week" : chartView === "Monthly" ? "Month" : "Date";

    return (
      <svg width={width} height={height + 60} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 10 }}>
        <line x1={axisPadding} y1={axisPadding} x2={axisPadding} y2={height - axisPadding} stroke="#e0e3e7" strokeWidth="1.5" />
        <line x1={axisPadding} y1={height - axisPadding} x2={width - axisPadding} y2={height - axisPadding} stroke="#e0e3e7" strokeWidth="1.5" />
        {/* Mood Level label horizontal on top of y axis */}
        <text
          x={axisPadding - leftLabelWidth / 2 - 10}
          y={axisPadding - 18}
          textAnchor="middle"
          fontSize="16"
          fill="#2563eb"
          style={{ fontWeight: 700, userSelect: "none" }}
        >
          Mood Level
        </text>
        {yLabelsGroup}
        <text x={axisPadding + (width - 2 * axisPadding) / 2} y={height - axisPadding + 54} textAnchor="middle" fontSize="15" fill="#2563eb" style={{ fontWeight: 700, userSelect: "none" }}>
          {xAxisTitle}
        </text>
        {xLabels}
      </svg>
    );
  }

  // --- Tooltip Overlay (fixed) ---
  function TooltipOverlay() {
    if (hoveredIndex == null) return null;
    // compute overlay coords for hovered index
    let x, y;
    if (chartView === "Daily") {
      const xStep = pointGap;
      x = plotPadding + hoveredIndex * xStep - scrollX;
      const yScale = (mood) => baseHeight - plotPadding - ((mood - 1) / 4) * (baseHeight - 2 * plotPadding);
      y = yScale(convertedData[hoveredIndex].mood);
    } else {
      const barW = 32, gap = 18;
      x = plotPadding + hoveredIndex * (barW + gap) - scrollX + barW / 2;
      const barHeight = ((convertedData[hoveredIndex].mood - 1) / 4) * (baseHeight - 2 * plotPadding);
      y = baseHeight - plotPadding - barHeight;
    }
    const d = convertedData[hoveredIndex];
    const emojiSrc = getEmojiSrc(d.emoji);
    const tooltipWidth = 130;
    const tooltipHeight = 80;
    let clampedX = x - tooltipWidth / 2;
    if (clampedX < 10) clampedX = 10;
    if (clampedX > chartWindowWidth - tooltipWidth - 10) clampedX = chartWindowWidth - tooltipWidth - 10;
    let clampedY = y - tooltipHeight - 18;
    if (clampedY < 12) clampedY = 12;

    return (
      <svg width={chartWindowWidth} height={baseHeight + 60} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 20 }}>
        <foreignObject x={clampedX} y={clampedY} width={tooltipWidth} height={tooltipHeight} style={{ overflow: "visible", pointerEvents: "none" }}>
          <div style={{
            background: "rgba(56,182,255,0.97)",
            color: "#fff",
            borderRadius: 16,
            padding: "8px 12px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid #fff",
            minWidth: 90,
            pointerEvents: "none",
            boxShadow: "0 4px 24px 0 rgba(56,182,255,0.18)",
          }}>
            <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.95 }}>{d.label}</div>
            {emojiSrc ? (
              <img src={emojiSrc} alt="emoji" style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: "1.5px solid #e0e3e7" }} />
            ) : (
              <div style={{ fontSize: 28 }}>{d.emoji || "?"}</div>
            )}
          </div>
        </foreignObject>
      </svg>
    );
  }

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="p-6" style={{ maxWidth: 540, margin: "0 auto", fontFamily: "'Canva Sans', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2563eb", marginBottom: 12 }}>Mood Analysis</h2>

      {/* Summary */}
      <div style={{ background: "#f5faff", padding: 14, borderRadius: 12, border: "1.5px solid #e0e3e7", display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#2563eb" }}>{chartView === "Daily" ? "Today" : chartView === "Weekly" ? "This Week" : "This Month"}</div>
          <div style={{ marginTop: 6, fontSize: 15 }}>{latest?.label ?? "—"}</div>
          <div style={{ marginTop: 8, color: "#38b6ff", fontWeight: 600 }}>
            {latest ? (
              <>
                <span style={{ marginRight: 8 }}>{latest.emoji || getMoodWord(latest.mood)}</span>
                {getMoodWord(latest.mood)}
                {currentHappyStreak > 1 && (<> — {currentHappyStreak}-day streak <span role="img" aria-label="star">🌟</span><span style={{ marginLeft: 6 }}><PulseStar show={currentHappyStreak > 5} /></span></>)}
              </>
            ) : "No data"}
          </div>
          <div style={{ marginTop: 6, color: "#888", fontSize: 13 }}>
            {latest && latest.mood ? (latest.mood <= 2 ? "Feeling down today 💙. Maybe write a short note in your journal?" : currentHappyStreak > 1 ? "Great job keeping the streak alive 🔥!" : "Keep checking in and take care of yourself!") : "Check in to log your mood."}
          </div>
        </div>
        <div style={{ minWidth: 56 }}>
          {latest && (() => {
            const src = getEmojiSrc(latest);
            return src ? <img src={src} alt="emoji" style={{ width: 56, height: 56, borderRadius: 10, background: "#fff", border: "1.5px solid #e0e3e7" }} /> : <div style={{ fontSize: 36 }}>{latest.emoji ?? getMoodWord(latest.mood)}</div>;
          })()}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {["Daily", "Weekly", "Monthly"].map(v => (
          <button key={v} onClick={() => { setChartView(v); setFadeKey(k => k + 1); setScrollX(0); }} style={{
            border: "none", background: chartView === v ? "#38b6ff" : "#f5f6f7", color: chartView === v ? "#fff" : "#2563eb", padding: "8px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer", boxShadow: chartView === v ? "0 2px 8px #38b6ff33" : "none"
          }}>{v}</button>
        ))}
      </div>

      {/* Insights */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          background: "#f8fafc",
          border: "1.5px solid #e0e3e7",
          borderRadius: 12,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: chartWindowWidth, // match chart width
          margin: "0 auto"
        }}>
          <div style={{ fontWeight: 700, color: "#2563eb" }}>Mood Insights</div>

          {chartView === "Daily" && dailyInsight && (
            <div style={{ background: "#eff8ff", padding: 10, borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#0ea5e9" }}>Today</div>
              <div style={{ marginTop: 6 }}>{dailyInsight}</div>
            </div>
          )}

          {chartView === "Weekly" && weeklyInsights.length > 0 && (
            <>
              {weeklyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff7ed",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#f59e0b" }}>
                    {(() => {
                      // Give each block a more descriptive title
                      if (insight.toLowerCase().includes("steady")) return "Weekly Mood Stability";
                      if (insight.toLowerCase().includes("up") || insight.toLowerCase().includes("down")) return "Weekly Mood Fluctuation";
                      if (insight.toLowerCase().includes("higher") || insight.toLowerCase().includes("lower")) return "Weekly Comparison";
                      if (insight.toLowerCase().includes("frequent mood")) return "Most Frequent Mood";
                      return "Weekly Insight";
                    })()}
                  </div>
                  <div style={{ marginTop: 6 }}>{insight}</div>
                </div>
              ))}
            </>
          )}

          {chartView === "Monthly" && monthlyInsights.length > 0 && (
            <>
              {monthlyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#ecfdf5",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#16a34a" }}>
                    {(() => {
                      // Give each block a more descriptive title
                      if (insight.toLowerCase().includes("average mood")) return "Monthly Average Mood";
                      if (insight.toLowerCase().includes("higher moods") || insight.toLowerCase().includes("lower than previous")) return "Monthly Comparison";
                      if (insight.toLowerCase().includes("dominant")) return "Dominant Mood";
                      if (insight.toLowerCase().includes("happy chain")) return "Longest Happy Chain";
                      return "Monthly Insight";
                    })()}
                  </div>
                  <div style={{ marginTop: 6 }}>{insight}</div>
                </div>
              ))}
            </>
          )}

          {trendChange && <div style={{ background: "#eff8ff", padding: 10, borderRadius: 8 }}><div style={{ fontWeight: 700, color: "#0ea5e9" }}>Trend</div><div style={{ marginTop: 6 }}>Recent avg {trendChange.last.toFixed(1)} is {trendChange.up ? "higher" : "lower"} than previous ({trendChange.prev.toFixed(1)}).</div></div>}
          {dominantMood && <div style={{ background: "#fff7ed", padding: 10, borderRadius: 8 }}><div style={{ fontWeight: 700, color: "#f59e0b" }}>Dominant Mood</div><div style={{ marginTop: 6 }}>{dominantMood} showed up most ({dominantMoodCount} times).</div></div>}
          {moodBalance === "neutral" && <div style={{ background: "#f3f4f6", padding: 10, borderRadius: 8 }}><div style={{ fontWeight: 700, color: "#374151" }}>Mood Balance</div><div style={{ marginTop: 6 }}>Many neutral days — maybe vary small activities to lift variety.</div></div>}
          {maxConsistentStreak > 1 && <div style={{ background: "#ecfdf5", padding: 10, borderRadius: 8 }}><div style={{ fontWeight: 700, color: "#16a34a" }}>Stability</div><div style={{ marginTop: 6 }}>Longest consistent streak: {maxConsistentStreak} days.</div></div>}
        </div>
      </div>

      {/* Streaks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,120px)",
          gap: 12,
          marginBottom: 18,
          width: chartWindowWidth,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div style={{ background: "#fef9c3", padding: 12, borderRadius: 12, textAlign: "center", border: "1.5px solid #fde68a" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Longest Happy Streak</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#92400e", marginTop: 6 }}>{maxHappyStreak} days 🌞</div>
        </div>
        <div style={{ background: "#e0f2fe", padding: 12, borderRadius: 12, textAlign: "center", border: "1.5px solid #bfdbfe" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0e7490" }}>Longest Consistent</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0e7490", marginTop: 6 }}>{maxConsistentStreak} days 🎯</div>
        </div>
        <div style={{ background: "#d1fae5", padding: 12, borderRadius: 12, textAlign: "center", border: "1.5px solid #bbf7d0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#065f46" }}>Current Streak</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#065f46", marginTop: 6 }}>{currentHappyStreak} days ⏳</div>
        </div>
      </div>

      {/* Chart (fixed axis overlay, scrollable content) */}
      <div
        key={fadeKey}
        style={{
          padding: 16,
          borderRadius: 12,
          background: "linear-gradient(180deg,#eff8ff,#e6f5ff)",
          border: "1px solid #e6f1fb",
          marginBottom: 24,
          position: "relative",
          width: chartWindowWidth, // match Mood Insights width
          maxWidth: "100%",
          minHeight: baseHeight + 60,
          overflow: "hidden",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h4 style={{ fontSize: 16, color: "#2563eb", marginBottom: 12 }}>
          <span style={{ marginRight: 8 }}>{chartView === "Daily" ? "📅" : chartView === "Weekly" ? "📊" : "❤️"}</span>
          Mood Chart
        </h4>

        {/* Chart type dropdown for Weekly/Monthly */}
        {(chartView === "Weekly" || chartView === "Monthly") && (
          <div style={{ marginBottom: 10, textAlign: "right" }}>
            <label style={{ fontWeight: 600, color: "#2563eb", fontSize: 13, marginRight: 8 }}>
              Chart Type:
            </label>
            <select
              value={chartView === "Weekly" ? weeklyChartType : monthlyChartType}
              onChange={e => {
                if (chartView === "Weekly") setWeeklyChartType(e.target.value);
                else setMonthlyChartType(e.target.value);
              }}
              style={{
                border: "1.5px solid #e0e3e7",
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: "#2563eb",
                background: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        )}

        <div
          ref={chartContainerRef}
          style={{
            width: chartWindowWidth,
            height: baseHeight + 60,
            overflow: "hidden",
            touchAction: "pan-y",
            cursor: dragging ? "grabbing" : "grab",
            margin: "0 auto",
            position: "relative",
            userSelect: "none",
          }}
          onMouseDown={handleChartPointerDown}
          onTouchStart={handleChartPointerDown}
        >
          {/* Moving chart content */}
          <div
            style={{
              width: chartTotalWidth,
              height: baseHeight + 60,
              transform: `translateX(-${scrollX}px)`,
              transition: dragging ? "none" : "transform 0.15s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {chartContentSvg}
          </div>

          {/* Fixed axis overlay */}
          <div style={{ width: chartWindowWidth, height: baseHeight + 60, position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 10 }}>
            <AxisOverlay />
            <TooltipOverlay />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 10, color: "#6b7280", fontSize: 12 }}>
          {chartView === "Daily" && "Drag left/right to see more days"}
          {chartView === "Weekly" && (weeklyChartType === "bar"
            ? "Bars = weekly average mood"
            : "Line = weekly average mood")}
          {chartView === "Monthly" && (monthlyChartType === "bar"
            ? "Bars = monthly average mood"
            : "Line = monthly average mood")}
        </div>
      </div>
    </div>
  );
}

/* small PulseStar helper */
function PulseStar({ show }) {
  return show ? (
    <span style={{ display: "inline-block", marginLeft: 6, animation: "pulse 1.2s infinite", fontSize: 20, verticalAlign: "middle" }}>
      ✨
      <style>{`@keyframes pulse {0% { transform: scale(1); opacity: 1;}50% { transform: scale(1.25); opacity: 0.7;}100% { transform: scale(1); opacity: 1;}}`}</style>
    </span>
  ) : null;
}
