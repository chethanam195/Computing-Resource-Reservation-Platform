import React, { useState } from 'react';

function JupyterPuttyPage() {
    const [showJupyter, setShowJupyter] = useState(false);

    // Function to launch Jupyter Notebook
    const openJupyter = () => {
        setShowJupyter(true); // Show the Jupyter Notebook by updating state
    };

    // Function to open PuTTY using the backend
    const openPutty = () => {
        fetch('http://localhost:5000/api/open-putty')
            .then(response => response.json())
            .then(data => console.log('PuTTY opened:', data))
            .catch(error => console.error('Error opening PuTTY:', error));
    };

    return (
        <div>
            <h1>Jupyter and PuTTY Page</h1>

            {/* Button to launch Jupyter Notebook */}
            <button onClick={openJupyter}>Open Jupyter Notebook</button>

            {/* Button to open PuTTY */}
            <button onClick={openPutty}>Open PuTTY</button>

            {/* Conditional rendering of the Jupyter Notebook iframe */}
            {showJupyter && (
                <iframe
                    src="http://localhost:8888" // Assuming Jupyter Notebook is running locally on port 8888
                    title="Jupyter Notebook"
                    style={{ width: '100%', height: '600px', border: 'none' }}
                />
            )}
        </div>
    );
}

export default JupyterPuttyPage;
