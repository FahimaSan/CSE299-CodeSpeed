import React, { useState, useEffect } from 'react';

import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

import Navbar from "./Navbar";

import ProfilePage from "./ProfilePage";
import PerformanceHistoryPage from "./PerformanceHistoryPage";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/check-auth', {
                    withCredentials: true,
                });
                setIsAuthenticated(response.data.loggedIn);
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
         
            <Navbar />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="/performance-history" element={<PerformanceHistoryPage />} />
            </Routes>
        </div>
    );
}

export default App;