import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
//import './registration.css'; // Make sure you have corresponding CSS for styling

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setErrorMessage('Password should be at least 6 characters.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setErrorMessage('');
            setSuccessMessage('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/'); // Redirect to login page after successful registration
            }, 1500);
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErrorMessage('This email is already registered. Please use a different email.');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    setErrorMessage('Password should be at least 6 characters.');
                    break;
                default:
                    setErrorMessage('An error occurred. Please try again.');
            }
            setSuccessMessage('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="form">
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
                <button type="submit" className="button">Register</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Registration;
