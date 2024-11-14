import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHandler = ({ onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createRazorpayOrder = async (amount) => {
        try {
            const response = await fetch('http://localhost:5000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency: 'INR' }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            alert('Error creating order. Please try again.');
        }
    };

    const handleRazorpayScreen = async () => {
        setLoading(true);
        const amount = 50000; // Example amount

        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!res) {
                alert('Failed to load Razorpay SDK. Please try again.');
                return;
            }

            // Create Razorpay order
            const order = await createRazorpayOrder(amount);
            if (order) {
                const options = {
                    key: 'rzp_test_1BkbvUiG6Er2NL', // Replace with your Razorpay test key
                    amount: order.amount,
                    currency: 'INR',
                    name: 'Your Company',
                    description: 'Payment for your order',
                    image: 'https://your-logo-url.com/logo.png', // Optional, can add logo
                    order_id: order.id, // Attach the order_id from the backend
                    handler: (response) => {
                        onPaymentSuccess(response.razorpay_payment_id); // Payment success callback
                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

                        // Ensure the navigate is called here
                        navigate('/jupyter-putty'); // Navigate to JupyterPuttyPage after payment success
                    },
                    prefill: {
                        name: 'Your Name',
                        email: 'youremail@example.com'
                    },
                    theme: {
                        color: '#F4C430' // Custom color for the Razorpay payment modal
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open(); // Open the Razorpay payment modal
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error during payment:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(false);
            document.body.appendChild(script);
        });
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <button onClick={handleRazorpayScreen} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default PaymentHandler;
