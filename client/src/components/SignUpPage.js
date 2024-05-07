import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../components/SignUpPage.css'; // Update the css file name

const SignInSignUpPage = () => {
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignInFormDisplayed, setIsSignInFormDisplayed] = useState(false); // Start with sign-up form displayed
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignInUsernameChange = (e) => {
    setSignInUsername(e.target.value);
  };

  const handleSignInPasswordChange = (e) => {
    setSignInPassword(e.target.value);
  };

  const handleSignUpUsernameChange = (e) => {
    setSignUpUsername(e.target.value);
  };

  const handleSignUpPasswordChange = (e) => {
    setSignUpPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    // Validate sign-in username and password
    if (!signInUsername || !signInPassword) {
      setErrorMessage('Please enter username and password for sign-in');
      return;
    }

    // Send sign-in data to backend
    const response = await fetch('http://127.0.0.1:5000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signInUsername, password: signInPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful sign-in
      console.log('Sign-in successful:', data.message);

      // Redirect to home with username
      navigate(`/home?username=${signInUsername}`); // Pass username as query parameter
    } else {
      // Handle sign-in errors
      setErrorMessage(data.message);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    // Validate sign-up username, password, and confirm password
    if (!signUpUsername || !signUpPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields for sign-up');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Send sign-up data to backend
    const response = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful sign-up
      console.log('Sign-up successful:', data.message);

      // Redirect to home with new username
      navigate(`/home?username=${data.username}`); // Pass username as query parameter
      setErrorMessage('');
    } else {
      // Handle sign-up errors
      setErrorMessage(data.message);
    }
  };

  const toggleForm = () => {
    setIsSignInFormDisplayed(!isSignInFormDisplayed);
    setErrorMessage('');
  };

  return (
    <div className="sign-in-sign-up-container">
      {!isSignInFormDisplayed ? (
        <div className="sign-up-form">
          <h2>Sign Up</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="signUpUsername">Username:</label>
              <input
                type="text"
                id="signUpUsername"
                value={signUpUsername}
                onChange={handleSignUpUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signUpPassword">Password:</label>
              <div className="password-input-container">
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  id="signUpPassword"
                  value={signUpPassword}
                  onChange={handleSignUpPasswordChange}
                />
                <button
                  className="toggle-password-btn"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                >
                  <FontAwesomeIcon icon={showSignUpPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <button
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button className="submitbtn" type="submit">
              Sign Up
            </button>
            <p>Already have an account? <button className="toggle-form-btn" onClick={toggleForm}>Sign In</button></p>
          </form>
        </div>
      ) : (
        <div className="sign-in-form">
          <h2>Sign In</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSignInSubmit}>
            <div className="form-group">
              <label htmlFor="signInUsername">Username:</label>
              <input
                type="text"
                id="signInUsername"
                value={signInUsername}
                onChange={handleSignInUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signInPassword">Password:</label>
              <div className="password-input-container">
                <input
                  type={showSignInPassword ? "text" : "password"}
                  id="signInPassword"
                  value={signInPassword}
                  onChange={handleSignInPasswordChange}
                />
                <button
                  className="toggle-password-btn"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                >
                  <FontAwesomeIcon icon={showSignInPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button className="submitbtn" type="submit">
              Sign In
            </button>
            <p>Don't have an account? <button className="toggle-form-btn" onClick={toggleForm}>Sign Up</button></p>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignInSignUpPage;
