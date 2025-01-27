import React, { useState } from 'react';
import './PackageManager.css';

const PackageManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [output, setOutput] = useState('');

    // Categories and Commands
    const categories = {
        httpd: [
            'yum install httpd',
            'yum remove httpd',
            'systemctl start httpd',
            'systemctl stop httpd',
            'systemctl restart httpd',
            'systemctl status httpd',
        ],
        python: [
            'yum install python3',
            'yum remove python3',
            'yum install python3-pip',
            'yum remove python3-pip',
            'yum update python3',
            'python3 --version',
            'python3 -m venv myenv', // Create a virtual environment
            'source myenv/bin/activate', // Activate virtual environment
            'pip install <package_name>', // Install a Python package
            'pip uninstall <package_name>', // Uninstall a Python package
            'pip freeze', // List installed Python packages
            'python3 -m pip install --upgrade pip', // Upgrade pip
            'python3 -m ensurepip', // Ensure that pip is installed
            'python3 -m venv myenv && source myenv/bin/activate && pip install -r requirements.txt',
            'python3 -m http.server', // Start a simple HTTP server
            'python3 -m unittest', // Run unit tests
            'python3 -m pip search <package_name>', // Search for a package on PyPI
        ],
        mysql: [
            'yum install mysql',
            'yum remove mysql',
            'systemctl start mysql',
            'systemctl stop mysql',
            'systemctl restart mysql',
            'systemctl status mysql',
        ],
    };

    const handleCopyCommand = (command) => {
        navigator.clipboard.writeText(command).then(
            () => setOutput(`Copied to clipboard: ${command}`),
            (err) => setOutput(`Failed to copy: ${err}`)
        );
    };

    const filteredCategories = Object.keys(categories).reduce((acc, category) => {
        const filteredCommands = categories[category].filter((cmd) =>
            cmd.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredCommands.length > 0) {
            acc[category] = filteredCommands;
        }
        return acc;
    }, {});

    return (
        <div className="auto-installation-container">
            <h1>Package Manager</h1>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search for a command..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Command Categories */}
            <div className="categories-container">
                {searchQuery && Object.keys(filteredCategories).length > 0 ? (
                    Object.keys(filteredCategories).map((category) => (
                        <div className="command-category-box" key={category}>
                            <h2>{category.toUpperCase()}</h2>
                            <div className="commands-container">
                                {filteredCategories[category].map((cmd, index) => (
                                    <div className="command-box" key={index}>
                                        <p>{cmd}</p>
                                        <button
                                            className="command-btn"
                                            onClick={() => handleCopyCommand(cmd)}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : searchQuery ? (
                    <p>No commands found for "{searchQuery}"</p>
                ) : (
                    <p>Enter a search term to find commands.</p>
                )}
            </div>

            {/* Output */}
            {output && <div className="footer"><p>{output}</p></div>}
        </div>
    );
};

export default PackageManager;
