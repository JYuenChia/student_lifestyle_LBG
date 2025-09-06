import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import '@fontsource/source-serif-4';
import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BottomBar from './pages/bottomBar';
import { PostsProvider } from './context/PostsContext.jsx';

// Lazy load all page components
const MessagePage = lazy(() => import('./pages/Chat/Chat.jsx'));
const DiscussionPage = lazy(() => import('./pages/Discussion/Discussion.jsx'));
const HomePage = lazy(() => import('./pages/Home/Home.jsx'));
const MainToDo = lazy(() => import('./pages/ToDoList/MainToDo.jsx'));
const SettingPage = lazy(() => import('./pages/Settings/SettingPage.jsx'));
const Profile = lazy(() => import('./pages/Discussion/Profile.jsx'));
const User = lazy(() => import('./pages/Discussion/User.jsx'));
const NewPost = lazy(() => import('./pages/Discussion/NewPost.jsx'));
const NewCommunity = lazy(() => import('./pages/Discussion/NewCommunity.jsx'));
const SignUp = lazy(() => import('./pages/Registration/SignUp.jsx'));
const Login = lazy(() => import('./pages/Registration/Login.jsx'));

import React from "react";

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #38b6ff',
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
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
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


