import React, { useState } from "react";

export default function Journal({ mood, onBack }) {
  const [entry, setEntry] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {mood ? `You are feeling: ${mood}` : "Journal"}
      </h2>
      <textarea
        className="w-full max-w-md p-3 rounded-lg border border-gray-300 mb-4"
        rows={8}
        placeholder="Write your journal entry here..."
        value={entry}
        onChange={e => setEntry(e.target.value)}
      />
      <button
        className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}