import React, { useState } from 'react';

function JupyterPutty() {
    const [showJupyter, setShowJupyter] = useState(false);

    const openJupyter = () => {
        setShowJupyter(true);
    };

    const openPutty = () => {
        fetch('http://localhost:5000/api/open-putty')
            .then(response => response.json())
            .then(data => console.log('PuTTY opened:', data))
            .catch(error => console.error('Error opening PuTTY:', error));
    };

    return (
        <div>
            <h1>Jupyter and PuTTY Page</h1>
            <button onClick={openJupyter}>Open Jupyter Notebook</button>
            <button onClick={openPutty}>Open PuTTY</button>
            {showJupyter && (
                <iframe
                    src="http://localhost:8888"
                    title="Jupyter Notebook"
                    style={{ width: '100%', height: '600px', border: 'none' }}
                />
            )}
        </div>
    );
}

export default JupyterPutty;
