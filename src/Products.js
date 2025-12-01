import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import EditProduct from './EditProduct';
import './App.css';

function Products({ authToken, onLogout }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dimensions: '',
        pricePerUnit: '',
        stockQuantity: '',
        description: '',
        weight: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const getAuthHeaders = () => {
        return {
            headers: { Authorization: `Bearer ${authToken}` }
        };
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/products`, getAuthHeaders());
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching products: ' + (err.response?.data || err.message));
            if (err.response?.status === 403) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);

        if (searchTerm.trim() === '') {
            fetchProducts();
        } else {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/products/search?name=${searchTerm}`,
                    getAuthHeaders()
                );
                setProducts(response.data);
            } catch (err) {
                console.error('Search error:', err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/products`, {
                name: formData.name,
                dimensions: formData.dimensions,
                pricePerUnit: parseFloat(formData.pricePerUnit),
                stockQuantity: parseInt(formData.stockQuantity),
                description: formData.description,
                weight: parseFloat(formData.weight)
            }, getAuthHeaders());

            setFormData({
                name: '',
                dimensions: '',
                pricePerUnit: '',
                stockQuantity: '',
                description: '',
                weight: ''
            });
            setShowForm(false);
            fetchProducts();
            alert('Product created successfully!');
        } catch (err) {
            console.error("Create product error:", err);
            const errorData = err.response?.data;
            let errorMessage = err.message;

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                }
            }
            alert('Error creating product: ' + errorMessage);
        }
    };

    const handleDeleteProduct = async (id) => {
        // if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, getAuthHeaders());
            fetchProducts();
            alert('Product deleted successfully!');
        } catch (err) {
            console.error("Delete product error:", err);
            const errorData = err.response?.data;
            let errorMessage = err.message;

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                }
            }
            alert('Error deleting product: ' + errorMessage);
        }
        // }
    };

    const handleUpdateSuccess = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        alert('Product updated successfully!');
    };

    return (
        <div className="products-container">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="🔍 Search products by name..."
                    value={search}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? '❌ Cancel' : '➕ Add Product'}
                </button>
            </div>

            {showForm && (
                <div className="form-section">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleCreateProduct} className="product-form">
                        <div className="form-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="dimensions"
                                placeholder="Dimensions (e.g., 600x200x100mm)"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="number"
                                name="pricePerUnit"
                                placeholder="Price Per Unit"
                                step="0.01"
                                value={formData.pricePerUnit}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="number"
                                name="stockQuantity"
                                placeholder="Stock Quantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="number"
                                name="weight"
                                placeholder="Weight (kg)"
                                step="0.01"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <textarea
                            name="description"
                            placeholder="Product Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            required
                        ></textarea>
                        <button type="submit" className="btn btn-success">
                            ✅ Create Product
                        </button>
                    </form>
                </div>
            )}

            {error && <div className="error-message">⚠️ {error}</div>}
            {loading && <div className="loading">Loading products...</div>}

            {!loading && products.length > 0 && (
                <div className="products-grid">
                    <h2>📦 Products ({products.length})</h2>
                    <div className="grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="card-header">
                                    <h3>{product.name}</h3>
                                    <span className="product-id">ID: {product.id}</span>
                                </div>
                                <div className="card-body">
                                    <p><strong>Dimensions:</strong> {product.dimensions}</p>
                                    <p><strong>Price:</strong> ₹{product.pricePerUnit.toFixed(2)}</p>
                                    <p><strong>Stock:</strong> {product.stockQuantity} units</p>
                                    <p><strong>Weight:</strong> {product.weight} kg</p>
                                    <p><strong>Description:</strong> {product.description}</p>
                                </div>
                                <div className="card-footer">
                                    <small>Created: {new Date(product.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="card-actions">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="btn btn-danger"
                                        style={{ flex: 1 }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="empty-state">
                    <p>No products found. Create your first product! 🚀</p>
                </div>
            )}

            {editingProduct && (
                <EditProduct
                    product={editingProduct}
                    authToken={authToken}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
}

export default Products;
