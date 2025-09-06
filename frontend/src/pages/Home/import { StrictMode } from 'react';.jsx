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
import NewPost from './pages/Discussion/NewPost.jsx';
import NewCommunity from './pages/Discussion/NewCommunity.jsx';
import BottomBar from './pages/bottomBar';
import { PostsProvider } from './context/PostsContext.jsx';

function MainLayout() {
  const location = useLocation();d"); // Debug log
  const hideBottomBar = location.pathname === '/login' || location.pathname === '/signup';
  const hideBottomBar = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: hideBottomBar ? "0" : "84.6px" }}>
      <div style={{ padding: '20px' }}>osition: "relative", paddingBottom: hideBottomBar ? "0" : "84.6px" }}>
        <Routes>={{ padding: '20px' }}>
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<MessagePage />} /> {/* Corrected path */}
          <Route path="/discussion" element={<DiscussionPage />} />orrected path */}
          <Route path="/todo" element={<MainToDo />} />nPage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/profile" element={<Profile />} />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/NewCommunity" element={<NewCommunity />} />
          <Route path="*" element={<div>Page Not Found</div>} /> {/* Fallback route */}
        </Routes>path="*" element={<div>Page Not Found</div>} /> {/* Fallback route */}
      </div>utes>
      {!hideBottomBar && <BottomBar />} {/* Ensure BottomBar is conditionally rendered */}
    </div>deBottomBar && <BottomBar />} {/* Ensure BottomBar is conditionally rendered */}
  );</div>
} );
}
import React from "react";
import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {tends React.Component {
    super(props);ps) {
    this.state = { hasError: false, error: null };
  } this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    console.error("ErrorBoundary caught an error:", error); // Log error
    return { hasError: true, error };ht an error:", error); // Log error
  } return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error details:", error, errorInfo); // Log error details
  } console.error("Error details:", error, errorInfo); // Log error details
  }
  render() {
    if (this.state.hasError) {
      return (tate.hasError) {
        <div style={{ padding: "20px", color: "red" }}>
          <h1>Something went wrong.</h1>olor: "red" }}>
          <p>{this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre> {/* Show stack trace */}
        </div>>{this.state.error?.stack}</pre> {/* Show stack trace */}
      );</div>
    } );
    return this.props.children;
  } return this.props.children;
} }
}
createRoot(document.getElementById('root')).render(
  <StrictMode>ument.getElementById('root')).render(
    <Router>e>
      <ErrorBoundary>
        <PostsProvider>
          <MainLayout />
        </PostsProvider>
      </ErrorBoundary>r>
    </Router>
  </StrictMode>
);

);  </StrictMode>    </Router>      </ErrorBoundary>    </Router>
  </StrictMode>
);