import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const SSHLoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState(22);
    const [isConnected, setIsConnected] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const term = useRef(null);

    useEffect(() => {
        if (!term.current && terminalRef.current) {
            term.current = new Terminal();
            term.current.open(terminalRef.current);
            term.current.onData((input) => {
                if (socketRef.current && isConnected) {
                    if (input === '\r') {
                        // Convert carriage return (Enter key) to newline
                        socketRef.current.send(JSON.stringify({ type: 'input', data: '\n' }));
                    } else {
                        socketRef.current.send(JSON.stringify({ type: 'input', data: input }));
                    }
                }
            });
        }
    }, [terminalRef.current]);

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

            if (term.current) {
                if (message.type === 'output') {
                    term.current.write(message.data);
                } else if (message.type === 'error') {
                    term.current.write(`\r\n[ERROR]: ${message.message}\r\n`);
                }
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
                            type={passwordVisible ? 'text' : 'password'}
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
