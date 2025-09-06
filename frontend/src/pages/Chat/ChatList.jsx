// src/pages/Chat/ChatList.jsx

// Dynamic image loading with Vite
const images = import.meta.glob('../../assets/images/*.{jpg,jpeg,png,gif}', { eager: true });

// Helper function to get community image source
const getCommunityImageSrc = (imagePath) => {
  // If it's already a full URL, return as is
  if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('https'))) {
    return imagePath;
  }
  
  // If it's a File object, create URL
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }
  
  // Try to find in imported images
  const imageKey = `../../assets/images/${imagePath}`;
  const imageModule = images[imageKey];
  if (imageModule) {
    return imageModule.default || imageModule;
  }
  
  // Fallback to trying the path directly
  return imagePath;
};

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
                  overflow: "hidden"
                }}
              >
                {/* Check if chat has a proper image path */}
                {chat.image && chat.image.length > 2 ? (
                  <img 
                    src={getCommunityImageSrc(chat.image)}
                    alt={chat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%"
                    }}
                    onError={(e) => {
                      // Fallback to first letter if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback to first letter */}
                <div style={{
                  display: (chat.image && chat.image.length > 2) ? 'none' : 'flex',
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color: "white",
                  backgroundColor: "#666",
                  borderRadius: "50%"
                }}>
                  {chat.name.charAt(0).toUpperCase()}
                </div>
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

