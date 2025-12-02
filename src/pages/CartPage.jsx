import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
        useCart();
    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'checkout'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'card',
    });

    const totalPrice = getTotalPrice();
    const taxAmount = totalPrice * 0.1; // 10% tax
    const shippingAmount = cartItems.length > 0 ? 50 : 0; // Flat $50 shipping
    const grandTotal = totalPrice + taxAmount + shippingAmount;

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formData.address ||
            !formData.city ||
            !formData.postalCode
        ) {
            alert('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You must be logged in to place an order.');
            navigate('/login');
            return;
        }

        try {
            // Create an order for each item in the cart
            const orderPromises = cartItems.map((item) => {
                const orderPayload = {
                    productId: item.id,
                    quantity: item.quantity,
                    customerName: formData.fullName,
                    status: 'NEW',
                    totalAmount: (Number(item.price || item.pricePerUnit || 0) * item.quantity)
                };

                return axios.post(`${API_BASE_URL}/api/orders`, orderPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });

            await Promise.all(orderPromises);

            alert('Order placed successfully! Order confirmation sent to your email.');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    if (cartItems.length === 0 && checkoutStep === 'cart') {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <div className="empty-icon">🛒</div>
                    <h2>Your Cart is Empty</h2>
                    <p>Add some AAC blocks to get started!</p>
                    <button
                        className="btn-back-shopping"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Header */}
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <p>Review your items before checkout</p>
            </div>

            <div className="cart-container">
                {/* Cart Items / Checkout Form */}
                <div className="cart-main">
                    {checkoutStep === 'cart' && (
                        <div className="cart-items-section">
                            <h2>Order Items ({cartItems.length})</h2>

                            <div className="cart-items-list">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/80'}
                                                alt={item.name}
                                            />
                                        </div>

                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p className="item-category">{item.category}</p>
                                            <p className="item-price">${Number(item.price || item.pricePerUnit || 0).toFixed(2)}</p>
                                        </div>

                                        <div className="item-quantity">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item.id, parseInt(e.target.value))
                                                }
                                                min="1"
                                            />
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="item-total">
                                            ${(Number(item.price || item.pricePerUnit || 0) * item.quantity).toFixed(2)}
                                        </div>

                                        <button
                                            className="btn-remove"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-actions">
                                <button
                                    className="btn-continue-shopping"
                                    onClick={() => navigate('/products')}
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}

                    {checkoutStep === 'checkout' && (
                        <div className="checkout-form-section">
                            <h2>Shipping & Billing</h2>

                            <form className="checkout-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleFormChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            placeholder="+91-9999999999"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleFormChange}
                                            placeholder="Pune"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleFormChange}
                                            placeholder="123 Construction Street, Site Name"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Postal Code *</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleFormChange}
                                            placeholder="411001"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleFormChange}
                                        >
                                            <option value="card">Credit / Debit Card</option>
                                            <option value="upi">UPI</option>
                                            <option value="bank">Bank Transfer</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="cart-summary">
                    <h3>Order Summary</h3>

                    <div className="summary-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span>${(Number(item.price || item.pricePerUnit || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax (10%)</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>${shippingAmount.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                        <span>Grand Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>

                    {checkoutStep === 'cart' && (
                        <button
                            className="btn-proceed-checkout"
                            onClick={() => setCheckoutStep('checkout')}
                        >
                            Proceed to Checkout →
                        </button>
                    )}

                    {checkoutStep === 'checkout' && (
                        <>
                            <button
                                className="btn-proceed-checkout"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                            <button
                                className="btn-back-cart"
                                onClick={() => setCheckoutStep('cart')}
                            >
                                ← Back to Cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
