import React, { useState } from 'react';
import { useTheme } from '../styles/theme';

function Login({ onLogin }) {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call to authenticate using electron API
      const result = await window.api.authenticate({ username, password });
      
      if (result.success) {
        onLogin();
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo mb-4">
          <h1 style={{ color: colors.primary }}>ACDMS</h1>
          <p className="text-center">Agniveer Centralised Data Management System</p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <small className="text-muted">
              Developed by ARC Shillong
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
