import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Importing eye icons

const SSHLoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState(22);
    const [isConnected, setIsConnected] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);  // To toggle password visibility
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const term = useRef(null);

    useEffect(() => {
        // Initialize the terminal when the terminalRef DOM element is ready
        if (!term.current && terminalRef.current) {
            term.current = new Terminal();
            term.current.open(terminalRef.current);
            term.current.onData((input) => {
                if (socketRef.current && isConnected) {
                    socketRef.current.send(JSON.stringify({ type: 'input', data: input }));
                }
            });
        }
    }, [terminalRef.current]); // Only initialize once when terminalRef is ready

    const handleConnect = () => {
        socketRef.current = new WebSocket('ws://localhost:5000');

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
            socketRef.current.send(
                JSON.stringify({
                    type: 'connect',
                    username,
                    password,
                    host,
                    port,
                })
            );
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // Check if terminal is initialized before writing to it
            if (term.current) {
                if (message.type === 'output') {
                    term.current.write(message.data);
                } else if (message.type === 'error') {
                    term.current.write(`\r\n[ERROR]: ${message.message}\r\n`);
                }
            } else {
                console.error('Terminal is not initialized');
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            alert('Failed to connect. Check server or credentials.');
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };
    };

    const handleDisconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        setIsConnected(false);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="ssh-login-form">
            {!isConnected ? (
                <div>
                    <h2>SSH Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div style={{ position: 'relative' }}>
                        <input
                            type={passwordVisible ? 'text' : 'password'} // Toggle between text and password input types
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                            }}
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <input
                        type="text"
                        placeholder="Host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Port"
                        value={port}
                        onChange={(e) => setPort(Number(e.target.value))}
                    />
                    <button onClick={handleConnect}>Connect</button>
                </div>
            ) : (
                <div>
                    <h2>SSH Terminal</h2>
                    <div
                        ref={terminalRef}
                        style={{
                            height: '500px',
                            width: '100%',
                            backgroundColor: '#000',
                            color: '#fff',
                        }}
                    ></div>
                    <button onClick={handleDisconnect}>Disconnect</button>
                </div>
            )}
        </div>
    );
};

export default SSHLoginComponent;
