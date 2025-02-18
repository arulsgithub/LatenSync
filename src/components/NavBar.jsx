import { Link } from "react-router-dom";
import "../css/navbar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">LatenSync</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/devices" className="nav-link">
          Device Management
        </Link>

        <Link to="/alerts" className="nav-link">
          Alerts
        </Link>
        <Link to="/dashboard" className="nav-link">
          Performance
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
