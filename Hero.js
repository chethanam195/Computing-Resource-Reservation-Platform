// Hero.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Hero.css'; // Assuming you have a Hero.css for styling

const Hero = () => (
    <section className="hero">
        <div className="hero-content">
            <h1>Welcome to the Computing Resources Booking Platform</h1>
            <p> HPC Virtual Lab uses resources from the Param Supercomputers.</p>
            <p>The platform provides necessary support to teach and learn parallel programming.</p><p>
                This virtual HPC lab will serve to boost the HPC and parallel programming learning through easy access to the virtual Lab platform, promoting tool experimentation and supporting HPC and AI training.</p>

            {/* Link to the Overview page */}

        </div>
    </section>
);

export default Hero;
