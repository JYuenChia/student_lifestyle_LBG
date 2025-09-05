import React from "react";

export default function EditJournalWindow({
  emoji,
  journal,
  onChangeJournal,
  onEditEmoji,
  onDone,
  onCancel,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ff5c87 0%, #40a0ff 40%, #78ffa5 70%, #ffaa78 90%, #aa8cff 100%)",
      }}
    >
      <div
        style={{
          border: "2.5px solid #38b6ff",
          borderRadius: "32px",
          background: "white",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "410px",
          minHeight: "480px",
          boxShadow: "0 8px 32px rgba(56,182,255,0.10)",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        {/* Emoji at top center */}
        <div
          style={{
            width: 64,
            height: 64,
            background: "#38b6ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "32px auto 12px auto",
            boxShadow: "0 2px 8px rgba(56,182,255,0.10)",
            overflow: "hidden",
          }}
        >
          {typeof emoji === "string" && emoji.startsWith("data:image") ? (
            <img
              src={emoji}
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
            <span style={{ fontSize: 32, color: "#fff" }}>{emoji}</span>
          )}
        </div>
        {/* Edit emoji button */}
        <button
          onClick={onEditEmoji}
          style={{
            background: "#fff",
            color: "#38b6ff",
            border: "1.5px solid #38b6ff",
            borderRadius: "12px",
            padding: "6px 22px",
            fontWeight: 700,
            fontFamily: "'Canva Sans', sans-serif",
            fontSize: 15,
            cursor: "pointer",
            marginBottom: 18,
          }}
        >
          Edit Emoji
        </button>
        {/* Journal textarea */}
        <textarea
          value={journal}
          onChange={e => onChangeJournal(e.target.value)}
          rows={8}
          placeholder="Continue your journal here..."
          style={{
            width: "85%",
            minHeight: "120px",
            fontFamily: "'Canva Sans', sans-serif",
            fontSize: 15,
            background: "#f5f6f7",
            border: "1.5px solid #e0e3e7",
            color: "#222",
            borderRadius: "14px",
            padding: "14px",
            marginBottom: 18,
            resize: "vertical",
            outline: "none",
          }}
        />
        {/* Done and Cancel buttons */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <button
            onClick={onCancel}
            style={{
              background: "#fff",
              color: "#38b6ff",
              border: "1.5px solid #38b6ff",
              borderRadius: "12px",
              padding: "10px 32px",
              fontWeight: 700,
              fontFamily: "'Canva Sans', sans-serif",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onDone}
            disabled={!journal.trim()}
            style={{
              background: "#38b6ff",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "10px 32px",
              fontWeight: 700,
              fontFamily: "'Canva Sans', sans-serif",
              fontSize: 16,
              cursor: journal.trim() ? "pointer" : "not-allowed",
              opacity: journal.trim() ? 1 : 0.5,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
