import React, { useState, useRef } from "react";
import Journal from "./Journal";

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

export default function MoodPicker({ onClose, onSave }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [pressedIndex, setPressedIndex] = useState(null);

  // Custom emoji state
  const [showCustom, setShowCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customDataUrl, setCustomDataUrl] = useState(null);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Handle custom emoji drawing
  function handleCanvasPointerDown(e) {
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    );
  }
  function handleCanvasPointerMove(e) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(
      (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    );
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function handleCanvasPointerUp() {
    setDrawing(false);
  }
  function handleClearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCustomDataUrl(null);
  }
  function handleDoneCustom() {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setCustomDataUrl(dataUrl);
    setSelectedMood("Custom");
    setShowCustom(false);
    setShowJournal(true);
  }

  // Show Journal with custom emoji
  if (showJournal && selectedMood) {
    return (
      <>
        <Journal
          mood={selectedMood === "Custom" ? customLabel : selectedMood}
          customEmoji={selectedMood === "Custom" ? customDataUrl : undefined}
          onBack={() => {
            setShowJournal(false);
            setSelectedMood(null);
            setCustomLabel("");
            setCustomDataUrl(null);
          }}
          onSave={({ journal }) => {
            onSave &&
              onSave({
                mood: selectedMood === "Custom" ? customLabel : selectedMood,
                emoji: selectedMood === "Custom" ? customDataUrl : undefined,
                journal,
              });
            setShowJournal(false);
            setSelectedMood(null);
            setCustomLabel("");
            setCustomDataUrl(null);
          }}
        />
      </>
    );
  }

  // Show custom emoji drawing UI
  if (showCustom) {
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
          background: "linear-gradient(135deg, #ff5c87 0%, #40a0ff 40%, #78ffa5 70%, #ffaa78 90%, #aa8cff 100%)",
        }}
      >
        <div
          className="flex flex-col items-center justify-center"
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
            position: "relative",
          }}
        >
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                fontSize: 32,
                color: "#38b6ff",
                cursor: "pointer",
                fontWeight: 700,
                zIndex: 2,
                padding: 0,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
          <h2
            className="text-xl font-bold text-gray-800 text-center"
            style={{
              fontFamily: "'Canva Sans', sans-serif",
              marginBottom: 24,
              marginTop: 12,
            }}
          >
            Draw your emoji!
          </h2>
          <canvas
            ref={canvasRef}
            width={96}
            height={96}
            style={{
              border: "2px solid #38b6ff",
              borderRadius: "24px",
              background: "#f5f6f7",
              marginBottom: 18,
              touchAction: "none",
              cursor: "crosshair",
            }}
            onMouseDown={handleCanvasPointerDown}
            onMouseMove={handleCanvasPointerMove}
            onMouseUp={handleCanvasPointerUp}
            onMouseLeave={handleCanvasPointerUp}
            onTouchStart={handleCanvasPointerDown}
            onTouchMove={handleCanvasPointerMove}
            onTouchEnd={handleCanvasPointerUp}
          />
          <button
            onClick={handleClearCanvas}
            style={{
              marginBottom: 18,
              background: "#fff",
              border: "1.5px solid #38b6ff",
              color: "#38b6ff",
              borderRadius: "10px",
              padding: "4px 18px",
              fontWeight: 600,
              fontFamily: "'Canva Sans', sans-serif",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Clear
          </button>
          <label
            htmlFor="custom-label"
            style={{
              fontFamily: "'Canva Sans', sans-serif",
              fontWeight: 500,
              fontSize: 15,
              marginBottom: 6,
              color: "#222",
              display: "block",
              textAlign: "center",
            }}
          >
            You are feeling:
          </label>
          <input
            id="custom-label"
            type="text"
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
            placeholder="Enter your emoji name"
            style={{
              width: "80%",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1.5px solid #e0e3e7",
              fontFamily: "'Canva Sans', sans-serif",
              fontSize: 15,
              marginBottom: 18,
              outline: "none",
            }}
          />
          <button
            onClick={handleDoneCustom}
            disabled={!customLabel.trim()}
            style={{
              background: "#38b6ff",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "10px 32px",
              fontWeight: 700,
              fontFamily: "'Canva Sans', sans-serif",
              fontSize: 16,
              cursor: customLabel.trim() ? "pointer" : "not-allowed",
              opacity: customLabel.trim() ? 1 : 0.5,
              marginTop: 6,
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

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
        background: "linear-gradient(135deg, #ff5c87 0%, #40a0ff 40%, #78ffa5 70%, #ffaa78 90%, #aa8cff 100%)",
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
          position: "relative",
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
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                fontSize: 32,
                color: "#38b6ff",
                cursor: "pointer",
                fontWeight: 700,
                zIndex: 2,
                padding: 0,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-800 text-center"
            style={{
              fontFamily: "'Canva Sans', sans-serif",
              marginBottom: 36, // more gap below heading
            }}
          >
            Your feelings matter.<br />
            Which mood fits you today?
          </h1>
          <div
            className="grid grid-cols-4 gap-6"
            style={{
              width: "100%",
              marginBottom: 40, // more gap below emoji grid
              marginTop: 0,
            }}
          >
            {moods.map((mood, index) => (
              <button
                key={index}
                onClick={() => {
                  if (mood.label === "Custom") {
                    setShowCustom(true);
                  } else {
                    setSelectedMood(mood.label);
                    setShowJournal(true);
                  }
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  setPressedIndex(null);
                }}
                onMouseDown={() => setPressedIndex(index)}
                onMouseUp={() => setPressedIndex(null)}
                style={{
                  background: selectedMood === mood.label ? "#e3f4fd" : "#f5f6f7",
                  border: activeIndex === index
                    ? "2.5px solid #38b6ff"
                    : selectedMood === mood.label
                      ? "2px solid #38b6ff"
                      : "1.5px solid #e0e3e7",
                  borderRadius: 20,
                  padding: "18px 0 10px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Canva Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#222",
                  boxShadow: selectedMood === mood.label
                    ? "0 2px 8px rgba(56,182,255,0.10)"
                    : "none",
                  transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                  cursor: "pointer",
                  outline: "none",
                  transform:
                    pressedIndex === index
                      ? "scale(1.13)"
                      : activeIndex === index
                        ? "scale(1.07)"
                        : "scale(1)",
                  zIndex: activeIndex === index ? 1 : 0,
                }}
              >
                <span style={{ fontSize: 32, transition: "font-size 0.18s" }}>{mood.emoji}</span>
                <span style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: selectedMood === mood.label ? "#38b6ff" : "#939598",
                  fontWeight: selectedMood === mood.label ? 700 : 500,
                }}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
          <p
            className="text-gray-500 text-center"
            style={{
              fontSize: 13,
              color: "#939598",
              marginTop: 0,
              marginBottom: 0,
              fontFamily: "'Canva Sans', sans-serif",
            }}
          >
            Tap a mood to start your journal for today.
          </p>
        </div>
      </div>
    </div>
  );
}