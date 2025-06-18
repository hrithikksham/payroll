import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection after login
import api from './api'; // Import our configured Axios instance

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    setError(''); // Reset any previous errors

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
      });

      // ---- Backend Response Handling ----
      // Assuming the backend responds with a token like { token: "your_jwt_token" }
      const token = response.data.token;

      if (token) {
        // 1. Store the token in localStorage
        localStorage.setItem('token', token);

        // 2. Redirect to the dashboard
        // The Axios interceptor will now automatically add the token to all future requests
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err) {
      // Handle login errors (e.g., wrong credentials, server error)
      const errorMessage = err.response?.data?.message || 'Invalid credentials or server error.';
      setError(errorMessage);
      console.error('Login Error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>anjo</h2> {/* Matches your wireframe */}
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Basic styling to match the wireframe's aesthetic
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#333'
    },
    loginBox: {
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        width: '300px'
    },
    title: {
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: 'bold'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid