import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import '@fontsource/source-serif-4';
import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MessagePage from './pages/Chat/Chat.jsx';
import DiscussionPage from './pages/Discussion/Discussion.jsx';
import HomePage from './pages/Home/Home.jsx';
import MainToDo from './pages/ToDoList/MainToDo.jsx';
import SettingPage from './pages/Settings/SettingPage.jsx';
import Profile from './pages/Discussion/Profile.jsx';
import User from './pages/Discussion/User.jsx';
import NewPost from './pages/Discussion/NewPost.jsx';
import NewCommunity from './pages/Discussion/NewCommunity.jsx';
import BottomBar from './pages/bottomBar';
import { PostsProvider } from './context/PostsContext.jsx';
import SignUp from './pages/Registration/SignUp.jsx';
import Login from './pages/Registration/Login.jsx';

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error("ErrorBoundary caught an error:", error); // Log error
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error details:", error, errorInfo); // Log error details
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre> {/* Show stack trace */}
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const location = useLocation();
  const hideBottomBar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: hideBottomBar ? "0" : "84.6px" }}>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/message" element={<MessagePage />} /> 
          <Route path="/discussion" element={<DiscussionPage />} />
          <Route path="/todo" element={<MainToDo />} />
          <Route path="/settingpage" element={<SettingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:username" element={<User />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/NewCommunity" element={<NewCommunity />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
      {!hideBottomBar && <BottomBar />} {/* Ensure BottomBar is conditionally rendered */}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ErrorBoundary>
        <PostsProvider>
          <MainLayout />
        </PostsProvider>
      </ErrorBoundary>
    </Router>
  </StrictMode>
);


