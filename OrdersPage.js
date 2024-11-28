import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ordersPage.css';

const OrdersPage = ({ onAddToCart }) => {
    const [participantName, setParticipantName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState('shortTerm');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const navigate = useNavigate();

    const planDetails = selectedPlan === 'shortTerm'
        ? { amount: 50000, days: 10 }
        : { amount: 100000, days: 30 };

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    const handlePlanChange = (event) => setSelectedPlan(event.target.value);

    useEffect(() => {
        const updatedEndDate = new Date(startDate);
        updatedEndDate.setDate(updatedEndDate.getDate() + planDetails.days * quantity);
        setEndDate(updatedEndDate);
    }, [startDate, selectedPlan, quantity]);

    const handleAddToCart = () => {
        if (!participantName.trim()) {
            alert('Please enter the participant name.');
            return;
        }

        const item = {
            amount: planDetails.amount * quantity,
            duration: planDetails.days * quantity,
            participantName,
            quantity,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };

        onAddToCart(item);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!participantName.trim()) {
            alert('Please enter the participant name.');
            return;
        }

        try {
            setLoading(true);
            await loadRazorpayScript();

            const response = await axios.post('http://localhost:5000/orders', {
                amount: planDetails.amount * quantity,
                currency: 'INR',
                duration: planDetails.days * quantity,
                start_date: startDate.toISOString().split('T')[0],
                participant_name: participantName,
                quantity,
            });

            const order = response.data;

            const options = {
                key: 'rzp_test_1BkbvUiG6Er2NL',
                amount: order.amount,
                currency: order.currency,
                order_id: order.order_id,
                handler: function (response) {
                    axios
                        .post('http://localhost:5000/payment/success', {
                            order_id: order.order_id,
                            payment_id: response.razorpay_payment_id,
                            participantName,
                        })
                        .then(() => {
                            alert('Payment successful!');
                            navigate('/Jupyterputty'); // Navigate to JupyterPutty page
                        })
                        .catch((err) => {
                            console.error('Payment error:', err);
                            alert('Payment failed, please try again.');
                        });
                },
                prefill: {
                    name: participantName,
                    email: 'test@example.com',
                },
                theme: {
                    color: '#F4C430',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewCart = () => {
        navigate('/cart');
    };

    return (
        <div className="orderpage-container">
            <h2>Order Details</h2>

            <div className="button-group">
                <div className="option-button">
                    <input
                        type="radio"
                        value="shortTerm"
                        checked={selectedPlan === 'shortTerm'}
                        onChange={handlePlanChange}
                    />
                    Short Term
                </div>
                <div className="option-button">
                    <input
                        type="radio"
                        value="longTerm"
                        checked={selectedPlan === 'longTerm'}
                        onChange={handlePlanChange}
                    />
                    Long Term
                </div>
            </div>

            <div className="plan-details">
                <div className="plan-input-group">
                    <label className="plan-label-input">Amount</label>
                    <input className="plan-value-input" value={`₹${planDetails.amount * quantity}`} disabled />
                </div>
                <div className="plan-input-group">
                    <label className="plan-label-input">Duration</label>
                    <input className="plan-value-input" value={`${planDetails.days * quantity} days`} disabled />
                </div>
                <div className="plan-input-group">
                    <label className="plan-label-input">Start Date</label>
                    <input className="plan-value-input" value={startDate.toISOString().split('T')[0]} disabled />
                </div>
                <div className="plan-input-group">
                    <label className="plan-label-input">End Date</label>
                    <input className="plan-value-input" value={endDate.toISOString().split('T')[0]} disabled />
                </div>
            </div>

            <div className="participant-input-group">
                <input
                    className="participant-input"
                    type="text"
                    placeholder="Enter participant name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                />
            </div>

            <div className="quantity-toggle-group">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <div className="button-group">
                <button className="cart-button" onClick={handleAddToCart}>Add to Cart</button>
                <button className="view-cart-button" onClick={handleViewCart}>View Cart</button>
                <button className="payment-button" onClick={handlePayment} disabled={loading}>
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
            </div>
        </div>
    );
};

export default OrdersPage;

