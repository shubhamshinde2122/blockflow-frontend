import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function EditOrder({ order, authToken, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        productId: '',
        customerName: '',
        quantity: '',
        status: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (order) {
            setFormData({
                productId: order.productId,
                customerName: order.customerName,
                quantity: order.quantity,
                status: order.status || 'NEW'
            });
        }
    }, [order]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8080/api/orders/${order.id}`,
                {
                    productId: parseInt(formData.productId),
                    customerName: formData.customerName,
                    quantity: parseInt(formData.quantity),
                    status: formData.status
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError('Error updating order: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>✏️ Edit Order</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product ID</label>
                            <input
                                type="number"
                                name="productId"
                                value={formData.productId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="form-select"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                            >
                                <option value="NEW">NEW</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditOrder;
