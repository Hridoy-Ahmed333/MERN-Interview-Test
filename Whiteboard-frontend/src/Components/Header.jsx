import { NavLink } from "react-router-dom";
import "./Header.css";
function Header() {
  return (
    <div className="header">
      <h1>Swift Whiteboard</h1>
      <div className="navigation-link-box">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
        >
          Home
        </NavLink>
        <NavLink
          to="/whiteboard"
          className={({ isActive }) => (isActive ? "active-link" : "nav-link")}
        >
          Whiteboard
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
