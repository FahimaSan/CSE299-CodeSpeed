import bcrypt from 'bcryptjs';
import { useState } from "react";
import axios from 'axios';
import "./RegisterPage.css"; // Using the same styles
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage,setSuccessMessage]=useState('');
  const navigate =useNavigate();

 const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // ... your validation checks

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const response = await axios.post('http://localhost:5000/register', {
            UserName: username,
            Email: email,
            Password_hash: hashedPassword, // Send the hashed password
        });

        console.log('Registration successful:', response.data);
        setSuccessMessage('Successfully Registered!');// Handle successful registration (e.g., redirect, show success message)
    } catch (err) {
        console.error('Registration failed:', err);
        setError('Registration failed. Please try again.');
        // Handle registration failure (e.g., show error message)
    }
};
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>Sign Up</h2>
          <form onSubmit={handleRegister}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            {successMessage && <p className="success-message">{successMessage}</p>}

            {error && <p className="error-message">{error}</p>}


            <button type="submit" className="auth-btn">Register</button>
          </form>
        </div>

        <div className="auth-right">
          <h2>Welcome to Register</h2>
          <p>Already have an account?</p>
          <Link to="/login" className="signup-btn">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
