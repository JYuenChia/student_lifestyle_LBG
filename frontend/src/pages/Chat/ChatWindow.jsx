// src/pages/Chat/ChatWindow.jsx
import { useState } from "react";

export default function ChatWindow({ chat, goBack, sendMessage }) {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);

  // Fixed array of 20 positive messages
  const positiveMessages = [
    "You're amazing!",
    "Keep it up!",
    "Great job!",
    "Stay positive!",
    "Believe in yourself!",
    "You got this!",
    "Well done!",
    "Awesome effort!",
    "Keep smiling!",
    "You're doing great!",
    "Fantastic work!",
    "Proud of you!",
    "Excellent!",
    "Keep shining!",
    "Superb!",
    "Way to go!",
    "Keep progressing!",
    "Amazing effort!",
    "You rock!",
    "Stay motivated!",
  ];

  const handleSend = () => {
    if (!input) return;
    const newMessage = {
      id: chat.messages.length + 1,
      sender: "me",
      text: input,
      time: "Now",
      read: false, // new messages start as unread
    };
    sendMessage(newMessage);
    setInput("");
    setShowOptions(false);
    setShowRecommended(false);
  };

  const handleOptionClick = (option) => {
    if (option === "recommended message") {
      setShowRecommended(!showRecommended);
    } else {
      alert(`Send ${option}`);
      setShowOptions(false);
    }
  };

  const handleRecommendedClick = (msg) => {
    const newMessage = {
      id: chat.messages.length + 1,
      sender: "me",
      text: msg,
      time: "Now",
      read: false,
    };
    sendMessage(newMessage);
    setShowRecommended(false);
    setShowOptions(false);
  };

  const optionBtnStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    background: "#f0f0f0",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={goBack}
        style={{
          marginBottom: "10px",
          background: "transparent",
          border: "none",
          color: "royalblue",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <h2 style={{ marginBottom: "15px" }}>{chat.name}</h2>

      {/* Messages area */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          background: "#f9f9f9",
          borderRadius: "10px",
        }}
      >
        {chat.messages.map((m) => (
          <div
            key={m.id}
            style={{
              textAlign: m.sender === "me" ? "right" : "left",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "15px",
                background: m.sender === "me" ? "royalblue" : "#eee",
                color: m.sender === "me" ? "#fff" : "#000",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {m.text}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#999",
                marginTop: "2px",
              }}
            >
              {m.time}{" "}
              {m.sender === "me" && (
                <span style={{ marginLeft: "5px" }}>{m.read ? "✓✓" : "✓"}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{ display: "flex", gap: "5px", position: "relative" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        {/* Clip button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          style={{
            padding: "0 12px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "royalblue",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          📎
        </button>
        {/* Send button */}
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "royalblue",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>

        {/* Clip options menu */}
        {showOptions && (
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              right: "0",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => handleOptionClick("location")} style={optionBtnStyle}>
                📍 Location
              </button>
              <button onClick={() => handleOptionClick("poll")} style={optionBtnStyle}>
                📊 Poll
              </button>
              <button onClick={() => handleOptionClick("document")} style={optionBtnStyle}>
                📄 Document
              </button>
              <button onClick={() => handleOptionClick("picture")} style={optionBtnStyle}>
                🖼️ Picture
              </button>
              <button
                onClick={() => handleOptionClick("recommended message")}
                style={optionBtnStyle}
              >
                💡 Recommended Message
              </button>
            </div>
          </div>
        )}

        {/* Recommended messages panel */}
        {showRecommended && (
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "10px",
              right: "10px",
              height: "50px",
              background: "linear-gradient(to right, #add8e6, #e0f7ff)",
              borderRadius: "25px",
              padding: "5px 15px",
              display: "flex",
              overflowX: "auto",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            {positiveMessages.map((msg, idx) => (
              <div
                key={idx}
                onClick={() => handleRecommendedClick(msg)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "15px",
                  background: "#f0f0f0",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
