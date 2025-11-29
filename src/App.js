import React, { useState, useEffect } from 'react';
import './App.css';
import Orders from './Orders';
import Products from './Products';
import Login from './Login';
import Register from './Register';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [currentPage, setCurrentPage] = useState("login"); // "login", "register", "dashboard"
  const [view, setView] = useState('products'); // 'products' or 'orders'

  useEffect(() => {
    if (authToken) {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("login");
    }
  }, [authToken]);

  const handleLogin = (token) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setAuthToken(null);
    setCurrentPage("login");
    setView('products');
  };

  if (!authToken) {
    if (currentPage === "register") {
      return <Register onSwitchToLogin={() => setCurrentPage("login")} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage("register")} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏢 BlockFlow API</h1>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
        </div>
        <div className="nav-buttons" style={{ marginTop: '10px' }}>
          <button
            className={`btn ${view === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('products')}
            style={{ marginRight: '10px' }}
          >
            📦 Products
          </button>
          <button
            className={`btn ${view === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('orders')}
          >
            📝 Orders
          </button>
        </div>
      </header>

      <main className="main">
        {view === 'orders' ? (
          <Orders authToken={authToken} onLogout={handleLogout} />
        ) : (
          <Products authToken={authToken} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;
