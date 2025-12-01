import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, categories = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('1000');
    const [sortBy, setSortBy] = useState('id');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Generate mock suggestions based on search term
        if (searchTerm.length > 0) {
            const mockSuggestions = [
                `${searchTerm}`,
                `${searchTerm} set`,
                `${searchTerm} blocks`,
                `${searchTerm} collection`,
            ];
            setSuggestions(mockSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    const triggerSearch = (override = {}) => {
        const payload = {
            q: searchTerm,
            category: selectedCategory,
            minPrice: parseFloat(minPrice),
            maxPrice: parseFloat(maxPrice),
            sortBy: sortBy,
            page: 0,
            ...override,
        };
        if (onSearch) {
            onSearch(payload);
        }
    };

    const handleSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        triggerSearch();
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        triggerSearch({ q: suggestion });
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                {/* Main Search Bar */}
                <div className="search-bar">
                    <div className="search-input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products (e.g. wooden blocks, toys, sets)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e);
                                }
                            }}
                        />
                        {searchTerm && (
                            <button
                                className="clear-btn"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSuggestions([]);
                                    triggerSearch({ q: '' });
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    🔍 {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filters Row */}
                <div className="filters-row">
                    {/* Category Filter */}
                    <select
                        className="filter-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Price Range */}
                    <div className="price-range">
                        <input
                            type="number"
                            className="price-input"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            className="price-input"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="id">Sort by</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                    </select>

                    {/* Main Search Button */}
                    <button className="search-btn" onClick={handleSearch}>
                        Search →
                    </button>
                </div>

                {/* Quick Filters */}
                <div className="quick-filters">
                    <button
                        className="quick-filter-btn"
                        onClick={() => {
                            setMaxPrice('50');
                            triggerSearch({ maxPrice: 50, page: 0 });
                        }}
                    >
                        Under $50
                    </button>
                    <button
                        className="quick-filter-btn"
                        onClick={() => {
                            setSortBy('popular');
                            triggerSearch({ sortBy: 'popular', page: 0 });
                        }}
                    >
                        Most Popular
                    </button>
                    <button
                        className="quick-filter-btn"
                        onClick={() => {
                            setSortBy('newest');
                            triggerSearch({ sortBy: 'newest', page: 0 });
                        }}
                    >
                        Newest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
