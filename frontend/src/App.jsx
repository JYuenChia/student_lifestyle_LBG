import { NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import messageIcon from './assets/images/message-icon.png';
import communityIcon from './assets/images/community-icon.png';
import homeIcon from './assets/images/home-icon.png';
import todoIcon from './assets/images/to-do-list.png';
import settingIcon from './assets/images/setting.png';

export default function App() {
  return (
    <div className="min-h-screen relative pb-16">
      <Home />
      <nav className="fixed left-0 bottom-0 w-full flex justify-around py-2 bg-card border-t border-border z-50">
        <NavLink
          to="/message"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
          }
        >
          <img src={messageIcon} alt="Message" className="w-6 h-6 mb-0.5" />
          <span>Message</span>  
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
          }
        >
          <img src={communityIcon} alt="Community" className="w-6 h-6 mb-0.5" />
          <span>Community</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
          }
        >
          <img src={homeIcon} alt="Home" className="w-6 h-6 mb-0.5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/todolist"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
          }
        >
          <img src={todoIcon} alt="Todo List" className="w-6 h-6 mb-0.5" />
          <span>Todo List</span>
        </NavLink>
        <NavLink
          to="/setting"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`
          }
        >
          <img src={settingIcon} alt="Setting" className="w-6 h-6 mb-0.5" />
          <span>Setting</span>
        </NavLink>
      </nav>
    </div>
  );
}