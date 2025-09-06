// src/pages/Chat/Chat.jsx
import { useState, Suspense, lazy } from "react";
import mockCommunities from "../../data/mockCommunities.json";

// Lazy load chat components
const ChatList = lazy(() => import("./ChatList.jsx"));
const ChatWindow = lazy(() => import("./ChatWindow.jsx"));

// Loading component for chat components
const ChatLoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    backgroundColor: 'white',
    borderRadius: '10px'
  }}>
    <div style={{
      width: '30px',
      height: '30px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #38b6ff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

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

export default function ChatPage() {
  const initialGroupChats = mockCommunities.myCommunities.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    type: "group",
    unread: true,
    messages: [
      { id: 1, sender: "them", text: `Welcome to ${c.name}!`, time: "10:00 AM" },
    ],
  }));

  const initialPrivateChats = [
    {
      id: 1001,
      name: "Alice",
      image: "A", // Use single letter as fallback
      type: "private",
      unread: true,
      messages: [
        { id: 1, sender: "them", text: "Hey there!", time: "Yesterday" },
        { id: 2, sender: "me", text: "Hi Alice!", time: "Yesterday", read: true },
        { id: 3, sender: "them", text: "How's it going?", time: "Yesterday" },
        { id: 4, sender: "me", text: "Good, thanks!", time: "Yesterday", read: true },
        { id: 5, sender: "them", text: "Awesome!", time: "Yesterday" },
      ],
    },
    {
      id: 1002,
      name: "Bob",
      image: "B", // Use single letter as fallback
      type: "private",
      unread: false,
      messages: [
        { id: 1, sender: "them", text: "Hello!", time: "2 days ago" },
        { id: 2, sender: "me", text: "Hey Bob", time: "2 days ago", read: true },
        { id: 3, sender: "them", text: "Did you finish the task?", time: "2 days ago" },
        { id: 4, sender: "me", text: "Almost done", time: "2 days ago", read: true },
        { id: 5, sender: "them", text: "Cool, thanks!", time: "2 days ago" },
      ],
    },
  ];

  const [chats, setChats] = useState([...initialGroupChats, ...initialPrivateChats]);
  const [activeChat, setActiveChat] = useState(null);

  const [chatRequests, setChatRequests] = useState([
    { id: 1, name: "Charlie", image: "C", type: "private" },
    { id: 2, name: "Diana", image: "D", type: "private" },
  ]);

  const [showRequests, setShowRequests] = useState(false);

  const openChat = (chat) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: false } : c))
    );
    setActiveChat(chat);
  };

  const goBack = () => setActiveChat(null);

  const sendMessage = (chatId, newMessage) => {
    setChats((prev) => {
      const updatedChats = prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, newMessage], unread: false }
          : c
      );

      const chatIndex = updatedChats.findIndex((c) => c.id === chatId);
      if (chatIndex > -1) {
        const [chatToTop] = updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chatToTop);
      }

      return updatedChats;
    });

    if (activeChat?.id === chatId) {
      setActiveChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
    }
  };

  const acceptRequest = (id) => {
    const req = chatRequests.find((r) => r.id === id);
    if (!req) return;

    setChats((prev) => [
      {
        id: Date.now(),
        name: req.name,
        image: req.image,
        type: "private",
        unread: true,
        messages: [
          { id: 1, sender: "them", text: "You can now chat with each other", time: "Now" },
        ],
      },
      ...prev,
    ]);

    setChatRequests((prev) => prev.filter((r) => r.id !== id));
    setShowRequests(false);
  };

  const rejectRequest = (id) => {
    setChatRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        background: "linear-gradient(to bottom, #add8e6, white)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <h1 style={{ color: "royalblue", textAlign: "center", marginBottom: "10px" }}>
        Message
      </h1>

      {/* Requests button below header, aligned right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", position: "relative" }}>
        <button
          onClick={() => setShowRequests((prev) => !prev)}
          style={{
            padding: "5px 12px",
            borderRadius: "20px",
            background: "white",
            border: "1px solid #ccc",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            color: "royalblue",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          Requests
          {chatRequests.length > 0 && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "red",
              }}
            />
          )}
        </button>

        {/* Chat Requests panel appears just below button */}
        {showRequests && (
          <div
            style={{
              position: "absolute",
              top: "40px", // below the button
              right: "0",
              width: "300px",
              maxHeight: "400px",
              overflowY: "auto",
              background: "#f0f8ff",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              zIndex: 100,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            {chatRequests.length === 0 ? (
              <p style={{ textAlign: "center" }}>No pending requests</p>
            ) : (
              chatRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "5px",
                    borderRadius: "5px",
                    background: "white",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        overflow: "hidden"
                      }}
                    >
                      {/* Check if request has a proper image path */}
                      {req.image && req.image.length > 2 ? (
                        <img 
                          src={getCommunityImageSrc(req.image)}
                          alt={req.name}
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
                        display: (req.image && req.image.length > 2) ? 'none' : 'flex',
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        color: "white",
                        backgroundColor: "#666",
                        borderRadius: "50%"
                      }}>
                        {req.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <span>{req.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => acceptRequest(req.id)}
                      style={{ padding: "5px", borderRadius: "5px", cursor: "pointer", background: "#d1ffd6" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(req.id)}
                      style={{ padding: "5px", borderRadius: "5px", cursor: "pointer", background: "#ffd1d1" }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Window or Chat List */}
      <div style={{ flex: 1 }}>
        <Suspense fallback={<ChatLoadingSpinner />}>
          {activeChat ? (
            <ChatWindow
              chat={activeChat}
              goBack={goBack}
              sendMessage={(msg) => sendMessage(activeChat.id, msg)}
            />
          ) : (
            <ChatList chats={chats} openChat={openChat} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
