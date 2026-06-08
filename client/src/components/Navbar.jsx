
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiCalendar } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let user = {};
  const token = localStorage.getItem("token");

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!token && ["/", "/login", "/register"].includes(location.pathname)) {
    return null;
  }

  if (!token) {
    return null;
  }

  const navLinkClass = (path) =>
    `navbar-link ${
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
        ? "navbar-link-active"
        : ""
    }`;

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/events" className="navbar-brand">
          <span className="navbar-logo">
            <FiCalendar size={18} />
          </span>

          <span className="navbar-title">
            EventHub
          </span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/events"
            className={navLinkClass("/events")}
          >
            Events
          </Link>

          <Link
            to="/my-bookings"
            className={navLinkClass("/my-bookings")}
          >
            My Bookings
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin/add-event"
              className="navbar-admin-btn"
            >
              Add Event
            </Link>
          )}
        </div>

        <div className="navbar-user-section">
          <span className="navbar-user">
            {user.name || "User"}
          </span>

          <button
            onClick={handleLogout}
            className="navbar-logout-btn"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-menu-btn"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="navbar-mobile-menu">
          <Link
            to="/events"
            className="navbar-mobile-link"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>

          <Link
            to="/my-bookings"
            className="navbar-mobile-link"
            onClick={() => setIsOpen(false)}
          >
            My Bookings
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin/add-event"
              className="navbar-mobile-admin"
              onClick={() => setIsOpen(false)}
            >
              Add Event
            </Link>
          )}

          <div className="navbar-mobile-user">
            {user.name || "User"}
          </div>

          <button
            onClick={handleLogout}
            className="navbar-mobile-logout"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}