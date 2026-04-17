import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // Assuming you have a LoginPage.css file

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Both fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: email,
                password: password,
            }, {
                withCredentials: true, // Enable session cookie
            });

            console.log('Login successful:', response.data);

            // ✅ Store logged-in user in localStorage for script.js to use
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate('/profile'); // Redirect after login
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-left">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input
                            type="text"
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
                        <div className="auth-options">
                            <label><input type="checkbox" /> Remember Me</label>
                            <Link to="/forgot-password" className="forgot-link">Forgot Password</Link>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="auth-btn">Sign In</button>
                    </form>
                </div>
                <div className="auth-right">
                    <h2>Welcome to Login</h2>
                    <p>Don't have an account?</p>
                    <Link to="/register" className="signup-btn">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
