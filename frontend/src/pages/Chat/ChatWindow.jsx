// src/pages/Chat/ChatWindow.jsx
import { useState } from "react";

export default function ChatWindow({ chat, goBack, sendMessage }) {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);

  const positiveMessages = [
    "You got this!", "Keep going!", "Stay positive!", "Great job!", 
    "Believe in yourself!", "Stay strong!", "You're so amazing!", "Keep smiling!",
    "Never give up!", "Fantastic work!", "Way to go!", "You rock!", 
    "Excellent!", "Well done!", "Proud of you!", "Stay focused!",
    "Keep learning!", "You're unstoppable!", "Awesome effort!", "Shine bright!"
  ];

  const handleSend = () => {
    if (!input) return;
    const newMessage = {
      id: chat.messages.length + 1,
      sender: "me",
      text: input,
      time: "Now",
      read: false,
    };
    sendMessage(newMessage);
    setInput("");
    setShowOptions(false);
    setShowRecommended(false);
  };

  const handleOptionClick = (option) => {
    if (option === "recommended message") {
      setShowRecommended(true);
    } else {
      alert(`Send ${option}`);
    }
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
      {/* Header */}
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

      {/* Messages */}
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
              {m.sender === "me" && <span style={{ marginLeft: "5px" }}>{m.read ? "✓✓" : "✓"}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{ 
        display: "flex", 
        gap: "5px", 
        position: "relative",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%"
      }}>
        {/* Text input */}
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
            minWidth: 0, // Prevents flex item from overflowing
            maxWidth: "calc(100% - 120px)" // Reserve space for buttons
          }}
        />
        {/* Emoji picker placeholder */}
        <button
          style={{
            padding: "8px 10px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#000",
            cursor: "pointer",
            fontSize: "18px",
            flexShrink: 0
          }}
        >
          😃
        </button>
        {/* Clip button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          style={{
            padding: "8px 10px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#000",
            cursor: "pointer",
            fontSize: "16px",
            flexShrink: 0
          }}
        >
          📎
        </button>
        {/* Send button */}
        <button
          onClick={handleSend}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "royalblue",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            flexShrink: 0,
            minWidth: "60px"
          }}
        >
          Send
        </button>

        {/* Clip options */}
        {showOptions && (
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              right: "50px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => handleOptionClick("location")} style={optionBtnStyle}>📍 Location</button>
              <button onClick={() => handleOptionClick("poll")} style={optionBtnStyle}>📊 Poll</button>
              <button onClick={() => handleOptionClick("document")} style={optionBtnStyle}>📄 Document</button>
              <button onClick={() => handleOptionClick("picture")} style={optionBtnStyle}>🖼️ Picture</button>
              <button onClick={() => handleOptionClick("recommended message")} style={optionBtnStyle}>💡 Recommended Message</button>
            </div>
          </div>
        )}
      </div>

      {/* Recommended message panel */}
      {showRecommended && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "0",
            right: "0",
            padding: "10px",
            background: "linear-gradient(to bottom, #add8e6, white)",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            display: "flex",
            overflowX: "auto",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowRecommended(false)}
            style={{
              marginRight: "10px",
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          {positiveMessages.map((msg, idx) => (
            <button
              key={idx}
              onClick={() => {
                sendMessage({
                  id: chat.messages.length + 1,
                  sender: "me",
                  text: msg,
                  time: "Now",
                  read: false,
                });
                setShowRecommended(false);
              }}
              style={{
                flex: "0 0 auto",
                padding: "10px 15px",
                borderRadius: "20px",
                border: "none",
                background: "white",
                cursor: "pointer",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {msg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

