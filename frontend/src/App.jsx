import MoodCycleChart from "./pages/Home/MoodCycleChart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// This file is no longer used for routing
// All routing is handled in main.jsx

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ...existing routes... */}
        <Route path="/mood-cycle-chart" element={<MoodCycleChart />} />
        {/* ...existing routes... */}
      </Routes>
    </Router>
  );
}

