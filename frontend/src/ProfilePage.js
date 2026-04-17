
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ UserName: "", Email: "", profilePic: "https://cdn-icons-png.flaticon.com/512/1160/1160865.png" });
  const [history, setHistory] = useState([]);

  

  useEffect(() => {
    axios.get("http://localhost:5000/profile", {
        withCredentials: true, // Send session cookie
    })
    .then((res) => {
        setUser({ ...res.data, profilePic: "https://cdn-icons-png.flaticon.com/512/1160/1160865.png" });
    })
    .catch(console.error);

    axios.get("http://localhost:5000/performance-history", {
        withCredentials: true, // Send session cookie
    })
    .then((res) => setHistory(res.data))
    .catch(console.error);
}, []);

  const handleEditClick = () => {
    navigate("/profile");
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-left">
          <h2>User Profile</h2>
          <div className="profile-pic-section">
            <img src={user.profilePic} alt="Profile" className="profile-image" />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={user.UserName} readOnly />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={user.Email} readOnly />
          </div>
          <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
        </div>

        <div className="profile-right">
          <h2>Welcome {user.UserName.split(" ")[0]}!</h2>
          <p>Keep your profile updated to enhance your typing journey.</p>
        </div>
      </div>

      <div className="profile-bottom">
        <div className="performance-history">
          <h3>Performance History (Past 7 Days)</h3>
          {history.length !== 0 ? (
            <p>Click here to see performance history.</p>
          ) : (
            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  
                </li>
              ))}
            </ul>
          )}
          <button className="view-history-btn" onClick={() => navigate("/performance-history")}>
            View Full History
          </button>
        </div>

        <div className="suggestions-box">
          <h3>Suggestions</h3>
          <p>(Coming Soon: AI-powered tips to improve typing speed)</p>
        </div>
      </div>
    </div>
  );
}



