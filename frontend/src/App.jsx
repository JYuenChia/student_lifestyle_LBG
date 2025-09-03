
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Discussion from './pages/Discussion';
import ToDo from './pages/ToDo';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

