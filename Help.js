import React from 'react';

const Help = () => {

    const handleHelpRedirect = () => {
        // Redirect directly to the Request Tracker tool URL
        window.location.href = "https://try.requesttracker.io/mitasjage_71491/"; // Your RT tool URL
    };

    // Automatically trigger the redirect when Help component is loaded
    React.useEffect(() => {
        handleHelpRedirect();
    }, []);

    return (
        <div>
            <h2>Redirecting to Request Tracker...</h2>
        </div>
    );
};

export default Help;
