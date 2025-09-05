import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import '@fontsource/source-serif-4';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MessagePage from './pages/Chat/Chat.jsx';
import DiscussionPage from './pages/Discussion/Discussion.jsx';
import HomePage from './pages/Home/Home.jsx';
import MainToDo from './pages/ToDoList/MainToDo.jsx';
import SettingPage from './pages/Settings/SettingPage.jsx';
import Profile from './pages/Discussion/Profile.jsx';
import NewPost from './pages/Discussion/NewPost.jsx';
import BottomBar from './pages/bottomBar';
import { PostsProvider } from './context/PostsContext.jsx';
import Login from './pages/Registration/Login.jsx';
import SignUp from './pages/Registration/SignUp.jsx';

function MainLayout() {
  const location = useLocation();
  const hideBottomBar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: hideBottomBar ? "0" : "60px" }}>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/discussion" element={<DiscussionPage />} />
          <Route path="/todo" element={<MainToDo />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/NewPost" element={<NewPost />} />
        </Routes>
      </div>
      {!hideBottomBar && <BottomBar />}
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

