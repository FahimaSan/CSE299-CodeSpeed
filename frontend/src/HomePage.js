import React from "react";
import "./HomePage.css";

export default function HomePage() {
  return (
    
    <div className="home-container">
       
      {/* Header Section */}
      <header className="hero">
        <h1>Learn to Code Faster and Easier for Free</h1>
        
        <p></p>
        <p>Helps to build faster-coding skills</p>
        <div className="buttons">

        <a href="Coding_Test.html" className="primary-btn">
            Start Typing Today »
          </a>
          
          <a href="http://localhost:3000/register" className="secondary-btn">Sign Up Now »</a>
        </div>
      </header>

      {/* Feature Section */}
      <section className="features">
        <h2>Go Beyond Typing with CodeSpeed</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/7546/7546214.png" alt="Keyboarding" />
            <p></p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/4257/4257483.png" alt="Tech Literacy" />
            <p></p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/2345/2345547.png" alt="Online Safety" />
            <p></p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/4396/4396623.png" alt="Coding" />
            <p></p>
          </div>
          <div className="feature-item">
            <img src="https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-career-line-icon-vector-png-image_6677598.png" alt="Career Prep" />
            <p></p>
          </div>
        </div>
      </section>
    </div>
  );
}
