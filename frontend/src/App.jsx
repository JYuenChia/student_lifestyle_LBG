import { NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", paddingBottom: "60px" }}>
      {/* Render the Home component or children above the task bar */}
      <Home />
      <nav
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0",
          backgroundColor: "#f0f0f0",
          borderTop: "1px solid #ccc",
          zIndex: 100,
        }}
      >
        <NavLink
          to="/message"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Message
        </NavLink>
        <NavLink
          to="/community"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Community
        </NavLink>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="/todolist"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Todo List
        </NavLink>
        <NavLink
          to="/setting"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Setting
        </NavLink>
      </nav>
    </div>
  );
}
