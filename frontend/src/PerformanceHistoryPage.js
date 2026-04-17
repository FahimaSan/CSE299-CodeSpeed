import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PerformanceHistoryPage.css";

export default function PerformanceHistoryPage() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/performance-history", {
        withCredentials: true, //  use session cookies
      })
      .then((res) => {
        setHistoryData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching performance history:", err);
        alert("Failed to fetch performance history. Please try again later.");
      });
  }, []);

  return (
    <div className="history-page">
      <h2>Your Performance History (Last 7 Days)</h2>
      <div className="history-list">
        {historyData.length === 0 ? (
          <p>No test results found for the past week.</p>
        ) : (
          historyData.map((entry, index) => (
            <div className="history-item" key={index}>
              <p><strong>Date:</strong> {new Date(entry.updated_date).toLocaleDateString()}</p>
              <p><strong>WPM:</strong> {entry.words_per_minute}</p>
              <p><strong>Accuracy:</strong> {entry.accuracy}%</p>
              <p><strong>Time Taken:</strong> {entry.time_taken}s</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
