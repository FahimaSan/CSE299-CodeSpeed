import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setLoggedIn(true);
          setUser(res.data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("Auth check error:", err);
        setLoggedIn(false);
        setUser(null);
      });
  }, [location.pathname]); // Add location.pathname as a dependency

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then((res) => {
        setLoggedIn(false);
        setUser(null);
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  const hideLoginAndRegister = location.pathname === "/profile";
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <nav className="navbar">
      <h1 className="logo">CodeSpeed</h1>
      {user && <li>Ready to code, {user.UserName} ? Let's go!</li>}
      <ul className="nav-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </li>
        
        {!hideLoginAndRegister && !loggedIn && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        {loggedIn && location.pathname === "/profile" && (
          <li>
            <button onClick={handleLogout}>Sign Out</button>
          </li>
        )}
        {loggedIn && location.pathname !== "/profile" && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}