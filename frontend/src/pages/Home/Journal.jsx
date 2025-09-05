import React, { useState, useEffect } from "react";

// Mood emoji mapping for display
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

export default function Journal({ mood, onBack, customEmoji, onSave, editJournalValue }) {
  const [entry, setEntry] = useState(editJournalValue || "");

  useEffect(() => {
    if (editJournalValue !== undefined) {
      setEntry(editJournalValue);
    }
  }, [editJournalValue]);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ff5c87 0%, #40a0ff 40%, #78ffa5 70%, #ffaa78 90%, #aa8cff 100%)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          border: "2.5px solid #38b6ff",
          borderRadius: "32px",
          background: "white",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "410px",
          minHeight: "540px",
          boxShadow: "0 8px 32px rgba(56,182,255,0.10)",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="bg-white rounded-3xl shadow-xl p-8 w-full flex flex-col items-center relative"
          style={{
            maxWidth: "370px",
            minWidth: "320px",
            margin: "0 auto",
          }}
        >
          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute left-4 top-4 text-blue-400 hover:text-blue-600 text-2xl font-bold"
            aria-label="Back"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              outline: "none",
              fontSize: 26,
              color: "#38b6ff",
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            ←
          </button>
          {/* Blue accent circle with mood emoji or custom emoji */}
          <div
            style={{
              width: 64,
              height: 64,
              background: "#38b6ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              marginTop: 8,
              boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
              overflow: "hidden",
            }}
          >
            {customEmoji ? (
              <img
                src={customEmoji}
                alt="Custom emoji"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  display: "block",
                  background: "#fff",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <span style={{ fontSize: 32, color: "#fff" }}>
                {moodEmojis[mood] ? (
                  <img
                    src={`emojis/${moodEmojis[mood]}.png`} // Use relative path for Vite preview/prod
                    alt={mood}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  "📝"
                )}
              </span>
            )}
          </div>
          <span
            className="text-lg font-semibold text-blue-600 mb-2"
            style={{
              fontFamily: "'Canva Sans', sans-serif",
              color: "#38b6ff",
            }}
          >
            {mood ? `You are feeling: ${mood}` : "Journal"}
          </span>
          {/* Prompt */}
          <p
            className="text-gray-500 text-center mb-4"
            style={{
              fontSize: 13,
              color: "#939598",
              fontFamily: "'Canva Sans', sans-serif",
            }}
          >
            Write about your day, your feelings, or anything on your mind.
          </p>
          {/* Journal textarea */}
          <textarea
            className="w-full p-4 rounded-xl border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 mb-4 resize-none text-gray-800 bg-blue-50 transition"
            rows={8}
            placeholder="Write your journal entry here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            style={{
              fontFamily: "'Canva Sans', sans-serif",
              fontSize: 15,
              background: "#f5f6f7",
              border: "1.5px solid #e0e3e7",
              color: "#222",
              margin: "16px 0", // Added margin for spacing
            }}
          />
          {/* Save and Back buttons */}
          <div className="flex w-full justify-between mt-4" style={{ gap: "16px" }}>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              onClick={onBack}
              style={{
                background: "#38b6ff",
                color: "#fff",
                fontFamily: "'Canva Sans', sans-serif",
                fontWeight: 600,
                border: "none",
                boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
                fontSize: 15,
              }}
            >
              Back
            </button>
            <button
              className="bg-white border border-blue-400 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              disabled={!entry.trim()}
              style={{
                opacity: entry.trim() ? 1 : 0.5,
                cursor: entry.trim() ? "pointer" : "not-allowed",
                background: "#fff",
                color: "#38b6ff",
                border: "1.5px solid #38b6ff",
                fontFamily: "'Canva Sans', sans-serif",
                fontWeight: 600,
                fontSize: 15,
              }}
              onClick={() => {
                if (onSave && entry.trim()) {
                  onSave({ journal: entry.trim() });
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}