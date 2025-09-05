// src/pages/Chat/ChatList.jsx
export default function ChatList({ chats, openChat }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "10px",
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      {chats.map((chat) => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        const lastMsgText =
          lastMsg.sender === "me" ? `You: ${lastMsg.text}` : lastMsg.text;

        return (
          <div
            key={chat.id}
            onClick={() => openChat(chat)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginRight: "10px",
                  fontSize: "18px",
                }}
              >
                {chat.image}
              </div>
              {chat.unread && lastMsg.sender === "them" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "red",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{chat.name}</div>
              <div style={{ color: "#555", fontSize: "14px" }}>{lastMsgText}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {lastMsg.time}
            </div>
          </div>
        );
      })}
    </div>
  );
}

