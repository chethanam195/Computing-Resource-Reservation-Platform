import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import OrdersPage from './OrdersPage';
import CartPage from './CartPage';
import JupyterPuttyPage from './JupyterPutty';
import PaymentHandler from './PaymentHandler';
import './App.css';

function App() {
    const [cart, setCart] = useState([]);
    const [responseId, setResponseId] = useState("");

    const handleAddToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
        alert("Item added to cart!");
    };

    const handleRemoveItem = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    // Payment Success handler
    const handlePaymentSuccess = (id, navigate) => {
        setResponseId(id);  // Set the response ID
        navigate('/jupyter-putty');  // Navigate to the JupyterPuttyPage
    };

    return (
        <Router>
            <div className="App">
                <Routes>
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
                    <Route path="/jupyter-putty" element={<JupyterPuttyPage />} />
                    <Route path="/" element={<OrdersPage onAddToCart={handleAddToCart} />} />
                    <Route
                        path="/payment"
                        element={
                            <PaymentHandler
                                onPaymentSuccess={handlePaymentSuccess} // Pass the success handler here
                            />
                        }
                    />
                </Routes>
                {responseId && <p>Payment ID: {responseId}</p>}
            </div>
        </Router>
    );
}

export default App;
