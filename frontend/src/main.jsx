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
      <nav style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ccc',
        zIndex: 100,
      }}>
        <NavLink to="/message" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Message</NavLink>
        <NavLink to="/community" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Community</NavLink>
        <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Home</NavLink>
        <NavLink to="/todolist" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Todo List</NavLink>
        <NavLink to="/setting" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>Setting</NavLink>
      </nav>
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

