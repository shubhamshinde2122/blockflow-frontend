import React, { useState } from 'react';
import axios from 'axios';
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
            const response = await axios.post('https://meticulous-smile-production-9fd4.up.railway.app/api/auth/login', formData);
            const { token, username } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
            onLogin(token);
        } catch (err) {
            setError(err.response?.data || 'Invalid credentials');
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
