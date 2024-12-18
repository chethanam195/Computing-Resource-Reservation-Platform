import React from 'react';
import './Footer.css'; // If you are importing a CSS file
const features = [
    { title: 'Compute', description: 'Run simulations, process data, and scale your workloads with on-demand resources tailored for your needs.' },
    { title: 'Storage', description: '5GB of secure cloud storage for all your data needs.' },
    { title: 'Jupyter', description: 'Free access to powerful computational notebooks for data analysis and development.' },
    { title: 'Putty', description: 'Secure remote access to your cloud resources for seamless management and configuration.' },
];

const Features = () => (
    <section className="features" id="features">
        <h2>Free Tier Features</h2>
        <div className="features-grid">
            {features.map((feature, index) => (
                <div key={index} className="feature-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            ))}
        </div>
    </section>
);

export default Features;
