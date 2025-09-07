import MoodCycleChart from "./pages/Home/MoodCycleChart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


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

