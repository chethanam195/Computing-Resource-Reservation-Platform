import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            // Reset error and message state before attempting to send reset email
            setError('');
            setMessage('');

            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset link has been sent to your email.');
        } catch (error) {
            // Handle errors returned by Firebase (invalid email, user not found, etc.)
            if (error.code === 'auth/invalid-email') {
                setError('The email address is not valid.');
            } else if (error.code === 'auth/user-not-found') {
                setError('No user found with this email address.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handlePasswordReset}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ForgotPassword;


