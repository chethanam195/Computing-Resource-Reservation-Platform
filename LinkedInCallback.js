import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LinkedInCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code'); // Authorization code from LinkedIn

        if (code) {
            // Exchange the code for an access token via your backend
            axios.post('http://localhost:5000/auth/linkedin', { code })
                .then(response => {
                    const { user, email } = response.data;
                    console.log('User:', user);
                    console.log('Email:', email);
                    // After successful login, navigate to welcome page with email
                    navigate(`/welcome/${email}`);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    navigate('/'); // Navigate back to login on error
                });
        }
    }, [navigate]);

    return (
        <div>
            <h2>Processing LinkedIn Login...</h2>
        </div>
    );
};

export default LinkedInCallback;
