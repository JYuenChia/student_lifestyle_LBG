// MoodAnalysis.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function MoodAnalysis({ moodData }) {
  // Convert mood emojis to numerical scores for analysis
  const moodScores = {
    "😊": 5,
    "❤️": 5,
    "😐": 3,
    "😖": 2,
    "😡": 1,
    "😢": 1,
    "😨": 2,
  };

  const emojiLabels = {
    5: "Positive",
    3: "Neutral",
    2: "Stressed/Fear",
    1: "Negative",
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    return Object.entries(moodData).map(([date, emoji]) => ({
      date,
      moodScore: moodScores[emoji] || 3, // Default Neutral
      emoji,
    }));
  }, [moodData]);

  // Calculate streaks
  const { longestPositiveStreak, currentStreak } = useMemo(() => {
    let longest = 0;
    let current = 0;

    Object.values(moodData).forEach((emoji) => {
      if (moodScores[emoji] >= 4) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 0;
      }
    });

    return { longestPositiveStreak: longest, currentStreak: current };
  }, [moodData]);

  // Get today’s mood
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const todaysMood = moodData[todayStr];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Mood Analysis</h2>

      {/* Mood Summary */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Today's Mood</h3>
        {todaysMood ? (
          <p className="text-2xl">
            {todaysMood} {emojiLabels[moodScores[todaysMood] || 3]}
          </p>
        ) : (
          <p className="text-muted-foreground">No mood entry for today yet.</p>
        )}
      </div>

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

      {/* Mood Trend Chart */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold mb-2">Mood Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tickFormatter={(v) => emojiLabels[v] || v} />
            <Tooltip
              formatter={(value) => {
                const label = emojiLabels[value] || "Unknown";
                return [`${label} (${value})`, "Mood"];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="moodScore"
              stroke="#38b6ff"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights placeholder */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h4 className="font-semibold text-yellow-700">Insights</h4>
        <p className="text-sm text-yellow-800 mt-1">
          Your moods are trending upward this week. Keep it up by taking breaks
          and celebrating small wins! 🎉
        </p>
      </div>
    </div>
  );
}
