import React, { useState } from "react";
import Journal from "./Home/Journal";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "Loving", emoji: "❤️" },
  { label: "Stress", emoji: "😖" },
  { label: "Mad", emoji: "😡" },
  { label: "Sad", emoji: "😢" },
  { label: "Bored", emoji: "😐" },
  { label: "Fear", emoji: "😨" },
  { label: "Custom", emoji: "➕" },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showJournal, setShowJournal] = useState(false);

  if (showJournal && selectedMood) {
    return (
      <Journal
        mood={selectedMood}
        onBack={() => {
          setShowJournal(false);
          setSelectedMood(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
        Your feelings matter.<br />Which mood fits you today?
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedMood(mood.label);
              setShowJournal(true);
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-transform transform hover:scale-105 ${
              selectedMood === mood.label ? "bg-purple-200" : "bg-white"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="mt-2 text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}