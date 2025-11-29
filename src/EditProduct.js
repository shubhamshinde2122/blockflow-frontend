import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function EditProduct({ product, authToken, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        dimensions: '',
        pricePerUnit: '',
        stockQuantity: '',
        description: '',
        weight: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                dimensions: product.dimensions,
                pricePerUnit: product.pricePerUnit,
                stockQuantity: product.stockQuantity,
                description: product.description,
                weight: product.weight
            });
        }
    }, [product]);

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
                `http://localhost:8080/api/products/${product.id}`,
                {
                    name: formData.name,
                    dimensions: formData.dimensions,
                    pricePerUnit: parseFloat(formData.pricePerUnit),
                    stockQuantity: parseInt(formData.stockQuantity),
                    description: formData.description,
                    weight: parseFloat(formData.weight)
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError('Error updating product: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>✏️ Edit Product</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Dimensions</label>
                            <input
                                type="text"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price Per Unit</label>
                            <input
                                type="number"
                                name="pricePerUnit"
                                step="0.01"
                                value={formData.pricePerUnit}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                step="0.01"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            required
                        ></textarea>
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

export default EditProduct;
