// src/pages/Chat/Chat.jsx
import { useState } from "react";
import ChatList from "./ChatList.jsx";
import ChatWindow from "./ChatWindow.jsx";
import mockCommunities from "../../data/mockCommunities.json";

export default function ChatPage() {
  // Convert myCommunities to chat objects
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

  // Add 2 fake private chats with multiple messages
  const initialPrivateChats = [
    {
      id: 1001,
      name: "Alice",
      image: "A",
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
      image: "B",
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

      // Move the chat with the new message to the top
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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to bottom, #add8e6, white)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "royalblue", marginBottom: "20px" }}>
        Message
      </h1>
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          goBack={goBack}
          sendMessage={(msg) => sendMessage(activeChat.id, msg)}
        />
      ) : (
        <ChatList chats={chats} openChat={openChat} />
      )}
    </div>
  );
}
