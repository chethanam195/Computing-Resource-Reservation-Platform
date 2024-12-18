import React from 'react';
import { Link } from 'react-router-dom'; // For navigating to other pages

const Categories = () => {
    return (
        <div className="categories-container">
            <h1>Categories</h1>

            <div className="category-item">
                <h2>Short Term</h2>
                <p>Browse our short-term options.</p>
                <Link to="/short-term">
                    <button>View Short Term</button>
                </Link>
            </div>

            <div className="category-item">
                <h2>Long Term</h2>
                <p>Browse our long-term options.</p>
                <Link to="/long-term">
                    <button>View Long Term</button>
                </Link>
            </div>
        </div>
    );
};

export default Categories;
