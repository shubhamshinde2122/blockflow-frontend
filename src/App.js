import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Orders from './Orders';
import ProductsPage from './pages/ProductsPage';
import LandingPage from './pages/LandingPage';
import Login from './Login';
import Register from './Register';
import CartPage from './pages/CartPage';
import { useCart } from './context/CartContext';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const { getTotalItems } = useCart();

  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setAuthToken(null);
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏢 BlockFlow API</Link></h1>
            {authToken ? (
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}
          </div>
          <div className="nav-buttons">
            <Link to="/products" className="btn btn-secondary">
              📦 Products
            </Link>
            {authToken && (
              <Link to="/orders" className="btn btn-secondary">
                📝 Orders
              </Link>
            )}
            <Link to="/cart" className="btn btn-secondary">
              🛒 Cart ({getTotalItems()})
            </Link>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={authToken ? <Navigate to="/" /> : <LoginWrapper onLogin={handleLogin} />} />
            <Route path="/register" element={authToken ? <Navigate to="/" /> : <RegisterWrapper />} />
            <Route path="/orders" element={authToken ? <Orders authToken={authToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrapper components to handle navigation after login/register
const LoginWrapper = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleLoginSuccess = (token) => {
    onLogin(token);
    navigate('/');
  };
  return <Login onLogin={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} />;
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <Register onSwitchToLogin={() => navigate('/login')} />;
};

export default App;
