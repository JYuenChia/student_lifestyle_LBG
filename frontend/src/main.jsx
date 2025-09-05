import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import '@fontsource/source-serif-4';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MessagePage from './pages/Chat/Chat.jsx';
import DiscussionPage from './pages/Discussion/Discussion.jsx';
import HomePage from './pages/Home/Home.jsx';
import TodoListPage from './pages/ToDoList/ToDo.jsx';
import SettingPage from './pages/Settings/SettingPage.jsx';
import Profile from './pages/Discussion/Profile.jsx';
import NewPost from './pages/Discussion/NewPost.jsx';
import BottomBar from './pages/bottomBar';
import { PostsProvider } from './context/PostsContext.jsx';
import { Toaster } from "@/components/ui/sonner";

function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: "60px" }}>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/discussion" element={<DiscussionPage />} />
          <Route path="/todo" element={<TodoListPage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/NewPost" element={<NewPost />} />
        </Routes>
      </div>
      <BottomBar />
      <Toaster />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <PostsProvider>
        <MainLayout />
      </PostsProvider>
    </Router>
  </StrictMode>
);

