import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import './ProductsPage.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        q: '',
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        sortBy: 'id',
        page: 0,
        limit: 12,
    });

    const PRODUCTS_API_URL = API_BASE_URL + '/api/products';

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when search params change
    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${PRODUCTS_API_URL}/categories/all`);
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                q: searchParams.q || '',
                category: searchParams.category || '',
                minPrice: searchParams.minPrice,
                maxPrice: searchParams.maxPrice,
                sortBy: searchParams.sortBy,
                page: searchParams.page,
                limit: searchParams.limit,
            });

            const response = await axios.get(
                `${PRODUCTS_API_URL}/search-advanced?${params.toString()}`
            );

            const { content, totalPages: pages } = response.data;
            setProducts(content || []);
            setTotalPages(pages || 0);
            setCurrentPage(searchParams.page);

            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (newParams) => {
        setSearchParams({
            ...newParams,
            page: 0, // Reset to first page on new search
        });
    };

    const handlePageChange = (pageIndex) => {
        setSearchParams({
            ...searchParams,
            page: pageIndex,
        });
    };

    return (
        <div className="products-page">
            {/* Search Bar Component */}
            <SearchBar onSearch={handleSearch} categories={categories} />

            {/* Products Container */}
            <div className="products-container">
                {/* Error Message */}
                {error && <div className="error-message">⚠️ {error}</div>}

                {/* Loading Spinner */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                )}

                {/* No Results */}
                {!loading && products.length === 0 && !error && (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h2>No Products Found</h2>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Results Info */}
                {!loading && products.length > 0 && (
                    <div className="results-info">
                        Showing {products.length} of {totalPages * searchParams.limit} products
                        {searchParams.q && ` for "${searchParams.q}"`}
                    </div>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className="products-grid">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="product-card"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                }}
                            >
                                {/* Product Image */}
                                <div className="product-image">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/200?text=Product'}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src =
                                                'https://via.placeholder.com/200?text=No+Image';
                                        }}
                                    />
                                    <div className="product-overlay">
                                        <button className="view-btn">View Details</button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>

                                    {/* Rating */}
                                    <div className="product-rating">
                                        {'⭐'.repeat(Math.min(product.rating || 5, 5))}
                                    </div>

                                    {/* Category Badge */}
                                    {product.category && (
                                        <span className="category-badge">{product.category}</span>
                                    )}

                                    {/* Price */}
                                    <div className="product-price">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="product-stock">
                                        {product.stock > 0 ? (
                                            <span className="in-stock">✓ {product.stock} in stock</span>
                                        ) : (
                                            <span className="out-stock">✗ Out of stock</span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="product-actions">
                                        <button className="btn-add-cart" disabled={product.stock === 0}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Component */}
                {!loading && products.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
