import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/SignUpPage.css'; // Update the css file name

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If username and password are empty, set error message
    if (!username || !password) {
      setErrorMessage('Please enter username and password');
      return;
    }

    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful login (e.g., redirect to dashboard)
      console.log('Login successful:', data.message);
      navigate('/home'); // Replace with your actual redirect path
    } else {
      // Handle login errors (e.g., display error message)
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="submitbtn" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
