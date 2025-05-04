// src/components/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';
    try {
      const response = await axios.post(url, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/report');
    } catch (error) {
      console.error(error);
      alert('Authentication error. Please check your credentials.');
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #614385, #516395)',
    color: '#fff',
    textAlign: 'center',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    width: '320px'
  };

  const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    width: '100%',
    borderRadius: '4px',
    border: 'none',
    marginBottom: '15px'
  };

  const buttonStyle = {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    backgroundColor: '#ff5555',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={containerStyle}>
      <h1>{isLogin ? 'Log In' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        {!isLogin && (
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange}
            style={inputStyle}
            required
          />
        )}
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ ...buttonStyle, backgroundColor: 'transparent', border: '1px solid #fff', marginTop: '20px' }}
      >
        {isLogin ? 'Switch to Sign Up' : 'Switch to Log In'}
      </button>
    </div>
  );
};

export default AuthPage;