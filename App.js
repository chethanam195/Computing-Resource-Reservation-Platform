import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './login.css';
import linkedinlogo from './linkedinlogo.png';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsEmailAuthenticated(true);
            setErrorMessage('');
            setSuccessMessage('Login successful!');
            setTimeout(() => {
                navigate('/Orderpage');
            }, 1500);
        } catch (error) {
            setIsEmailAuthenticated(false);
            setSuccessMessage('');
            setErrorMessage('Login failed. Please try again.');
        }
    };

    const handleLinkedInLogin = () => {
        const clientId = "86xul1q9z5qlog";
        const redirectUri = "http://localhost:3000/linkedin/callback";
        const scope = "r_liteprofile%20r_emailaddress";
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

        window.location.href = url;
    };

    const handleGoogleSuccess = async (response) => {
        // Once the Google login is successful, navigate to the Orders page
        navigate('/Orderpage');
    };

    const handleGoogleFailure = (error) => {
        console.error("Google login failure: ", error);
        setErrorMessage('Google login failed. Please try again.');
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form">
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                            className="eye-icon"
                        />
                    </div>
                </div>
                <button type="submit" className="button">Login</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <p><a href="#" onClick={() => navigate('/forget-password')}>Forget Password?</a></p>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>

            <button className="linkedin-button" onClick={handleLinkedInLogin}>
                <img src={linkedinlogo} alt="LinkedIn Logo" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                Login with LinkedIn
            </button>

            <div className="google-login">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                />
            </div>
        </div>
    );
};

export default Login;
