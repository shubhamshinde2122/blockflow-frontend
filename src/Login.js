import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './App.css';

function Login({ onLogin, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
            const { token, username } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
            onLogin(token);
        } catch (err) {
            console.error("Login error:", err);

            if (!err.response) {
                setError('Network error: Unable to connect to server. Is the backend running?');
                return;
            }

            const errorData = err.response?.data;
            let errorMessage = 'Invalid credentials';

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    // Handle Spring Boot error object or other object responses
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                    // Ensure it's a string even if message/error was an object
                    if (typeof errorMessage === 'object') {
                        errorMessage = JSON.stringify(errorMessage);
                    }
                }
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <h2>🔐 Login to BlockFlow</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className="auth-switch">
                Don't have an account? <button onClick={onSwitchToRegister} className="link-btn">Register here</button>
            </p>
        </div>
    );
}

export default Login;
