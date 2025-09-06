import React from "react";
import { emojiToScale, scaleToEmoji } from "./moodScale";

export default function MoodAnalysis({ moodData }) {
  // Convert object to array [{date, mood, emoji}]
  const convertedData = Object.entries(moodData).map(([date, value]) => {
    if (typeof value === "object" && value !== null && "scale" in value) {
      // Custom mood with scale and emoji (could be a data URL)
      return { date, mood: value.scale, emoji: value.emoji };
    }
    // Normal emoji
    return { date, mood: emojiToScale[value] || 3, emoji: value };
  });

  if (convertedData.length === 0) {
    return <p className="text-gray-500">No mood data available.</p>;
  }

  // --- Chart setup ---
  const width = 300;
  const height = 150;
  const padding = 20;

  const maxMood = 5;
  const minMood = 1;

  const xStep =
    convertedData.length > 1
      ? (width - 2 * padding) / (convertedData.length - 1)
      : 0;

  const yScale = (mood) =>
    height -
    padding -
    ((mood - minMood) / (maxMood - minMood)) * (height - 2 * padding);

  const pathD = convertedData
    .map((d, i) => {
      const x = padding + i * xStep;
      const y = yScale(d.mood);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  // --- Streak calculations ---
  let longestPositiveStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  convertedData.forEach((d, i) => {
    if (d.mood >= 3) {
      tempStreak++;
      if (tempStreak > longestPositiveStreak) {
        longestPositiveStreak = tempStreak;
      }
      if (i === convertedData.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Mood Analysis</h2>

      {/* Streaks */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-600">Longest Positive Streak</h4>
          <p className="text-2xl font-bold">{longestPositiveStreak} days</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <h4 className="font-semibold text-green-600">Current Streak</h4>
          <p className="text-2xl font-bold">{currentStreak} days</p>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold mb-2">Mood Trend</h4>
        <svg width={width} height={height} className="bg-white rounded-lg border">
          {/* Y axis emoji labels */}
          {[5, 4, 3, 2, 1].map((val) => {
            // Show emoji if available, else fallback to scale number
            const emoji = scaleToEmoji[val];
            return (
              <text key={val} x={2} y={yScale(val) + 4} fontSize="12">
                {emoji || val}
              </text>
            );
          })}

          {/* Line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />

          {/* Dots */}
          {convertedData.map((d, i) => {
            const x = padding + i * xStep;
            const y = yScale(d.mood);
            // Ensure d.emoji is a string (either emoji or data URL)
            let emojiToRender = d.emoji;
            if (typeof emojiToRender === "object" && emojiToRender !== null && "emoji" in emojiToRender) {
              emojiToRender = emojiToRender.emoji;
            }
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="#3b82f6" />
                {/* If emoji is a data URL, render as image; else as text */}
                {typeof emojiToRender === "string" && emojiToRender.startsWith("data:") ? (
                  <image
                    href={emojiToRender}
                    x={x - 10}
                    y={y - 30}
                    width={20}
                    height={20}
                  />
                ) : (
                  typeof emojiToRender === "string" && (
                    <text x={x} y={y - 10} fontSize="14" textAnchor="middle">
                      {emojiToRender}
                    </text>
                  )
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
