import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './Login'; // Ensure proper import
import LinkedinCallback from './LinkedinCallback';
import ForgetPassword from './ForgetPassword';
import Registration from './Registration';
import OrdersPage from './OrdersPage';
import CartPage from './CartPage';
import Jupyterputty from './Jupyterputty'; // Ensure proper import
import PaymentHandler from './PaymentHandler';
import firebaseConfig from './firebaseConfig';
import './App.css';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
    const [cart, setCart] = useState([]);
    const [responseId, setResponseId] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in: ", user);
            } else {
                console.log("No user is logged in.");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
        alert("Item added to cart!");
    };

    const handleRemoveItem = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const handlePaymentSuccess = (id) => {
        setResponseId(id);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} /> {/* Corrected here */}
                    <Route path="/register" element={<Registration />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/linkedin/callback" element={<LinkedinCallback />} />
                    <Route path="/orders" element={<OrdersPage onAddToCart={handleAddToCart} />} />
                    <Route
                        path="/cart"
                        element={
                            <CartPage
                                cart={cart}
                                onRemoveItem={handleRemoveItem}
                            />
                        }
                    />
                    <Route
                        path="/payment"
                        element={
                            <PaymentHandler
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        }
                    />
                    <Route path="/jupyter-putty" element={<Jupyterputty />} />
                </Routes>
                {responseId && <p>Payment ID: {responseId}</p>}
            </div>
        </Router>
    );
};

export default App;

