import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import EditOrder from './EditOrder';
import './App.css';

function Orders({ authToken, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [formData, setFormData] = useState({
        productId: '',
        customerName: '',
        quantity: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const getAuthHeaders = () => {
        return {
            headers: { Authorization: `Bearer ${authToken}` }
        };
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/orders`, getAuthHeaders());
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching orders: ' + (err.response?.data || err.message));
            if (err.response?.status === 403) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/orders`, {
                productId: parseInt(formData.productId),
                customerName: formData.customerName,
                quantity: parseInt(formData.quantity)
            }, getAuthHeaders());

            setFormData({
                productId: '',
                customerName: '',
                quantity: ''
            });

            fetchOrders();
            alert('Order created successfully!');
        } catch (err) {
            console.error("Create order error:", err);
            const errorData = err.response?.data;
            let errorMessage = err.message;

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                }
            }
            alert('Error creating order: ' + errorMessage);
        }
    };

    const handleDeleteOrder = async (id) => {

        // if (window.confirm('Are you sure you want to delete this order?')) {
        try {

            await axios.delete(`${API_BASE_URL}/api/orders/${id}`, getAuthHeaders());

            fetchOrders();
            alert('Order deleted successfully!');
        } catch (err) {
            console.error("Delete failed:", err);
            const errorData = err.response?.data;
            let errorMessage = err.message;

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                }
            }
            alert('Error deleting order: ' + errorMessage);
        }
        // }
    };

    const handleUpdateSuccess = (updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        alert('Order updated successfully!');
    };

    return (
        <div className="orders-container">
            <h2>📦 Order Management</h2>

            <div className="form-section">
                <h3>Create New Order</h3>
                <form onSubmit={handleCreateOrder} className="product-form">
                    <div className="form-row">
                        <input
                            type="number"
                            name="productId"
                            placeholder="Product ID"
                            value={formData.productId}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Customer Name"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success">
                        ✅ Place Order
                    </button>
                </form>
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            {loading ? (
                <div className="loading">Loading orders...</div>
            ) : orders.length > 0 ? (
                <div className="table-responsive">
                    <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Product ID</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Customer</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Quantity</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Total Amount</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Status</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Date</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{order.id}</td>
                                    <td style={{ padding: '12px' }}>{order.productId}</td>
                                    <td style={{ padding: '12px' }}>{order.customerName}</td>
                                    <td style={{ padding: '12px' }}>{order.quantity}</td>
                                    <td style={{ padding: '12px' }}>₹{order.totalAmount?.toFixed(2)}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: order.status === 'NEW' ? '#e3f2fd' : '#f5f5f5',
                                            color: order.status === 'NEW' ? '#1976d2' : '#333'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                                        <button
                                            onClick={() => setEditingOrder(order)}
                                            className="btn btn-primary"
                                            style={{ padding: '5px 10px', fontSize: '0.9em' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '5px 10px', fontSize: '0.9em' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <p>No orders found. Place your first order! 🚀</p>
                </div>
            )}

            {editingOrder && (
                <EditOrder
                    order={editingOrder}
                    authToken={authToken}
                    onClose={() => setEditingOrder(null)}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
}

export default Orders;
