import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import '@fontsource/source-serif-4';
import './index.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import MessagePage from './pages/Message.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import HomePage from './pages/Home.jsx';
import TodoListPage from './pages/TodoListPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import BottomBar from './pages/bottomBar';

function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: "60px" }}>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/todolist" element={<TodoListPage />} />
          <Route path="/setting" element={<SettingPage />} />
        </Routes>
      </div>
      <BottomBar />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <MainLayout />
    </Router>
  </StrictMode>
);

