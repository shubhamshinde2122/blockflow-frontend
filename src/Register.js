import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './App.css';

function Register({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            setSuccess('Registration successful! Please login.');
            setError(null);
            setTimeout(() => onSwitchToLogin(), 2000);
        } catch (err) {
            console.error("Registration error:", err);

            if (!err.response) {
                setError('Network error: Unable to connect to server. Is the backend running?');
                setSuccess(null);
                return;
            }

            const errorData = err.response?.data;
            let errorMessage = 'Registration failed';

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                    if (typeof errorMessage === 'object') {
                        errorMessage = JSON.stringify(errorMessage);
                    }
                }
            }
            setError(errorMessage);
            setSuccess(null);
        }
    };

    return (
        <div className="auth-container">
            <h2>📝 Register for BlockFlow</h2>
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
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p className="auth-switch">
                Already have an account? <button onClick={onSwitchToLogin} className="link-btn">Login here</button>
            </p>
        </div>
    );
}

export default Register;
