import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/products');
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-tag">Premium AAC Blocks • Direct from Factory</span>
                    <h1 className="hero-title">
                        Build Stronger,
                        <span> Faster & Lighter</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover high–quality AAC blocks with precise dimensions, superior strength,
                        and fast delivery. Designed for modern construction projects and sustainable building.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary" onClick={handleShopNow}>
                            Shop AAC Blocks →
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                const element = document.getElementById('features');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            Explore Features
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">250+</span>
                            <span className="stat-label">Projects Delivered</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">30%</span>
                            <span className="stat-label">Faster Construction</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">40%</span>
                            <span className="stat-label">Weight Reduction</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card main-card">
                        <h3>AAC Block Bundle</h3>
                        <p>Precision-cut, high strength, ready to ship.</p>
                        <div className="hero-card-meta">
                            <span>★ 4.9 rating</span>
                            <span>3–5 days delivery</span>
                        </div>
                    </div>

                    <div className="hero-card side-card">
                        <h4>Thermal Efficient</h4>
                        <p>Keep buildings cooler, save energy costs.</p>
                    </div>

                    <div className="hero-floating-badge">ISO Certified • Eco Friendly</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <h2 className="section-title">Why Choose Our AAC Blocks?</h2>
                <p className="section-subtitle">
                    Engineered for modern builders who demand quality, speed, and sustainability.
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🏗️</div>
                        <h3>High Strength & Precision</h3>
                        <p>
                            Uniform dimensions and high compressive strength for faster, cleaner masonry work.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🌡️</div>
                        <h3>Thermal & Sound Insulation</h3>
                        <p>
                            Reduce heat transfer and noise, ideal for residential and commercial projects.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Faster Construction</h3>
                        <p>
                            Lightweight blocks mean less dead load, easier handling, and quicker installation.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🌱</div>
                        <h3>Eco–Friendly Material</h3>
                        <p>
                            Low environmental impact with excellent resource efficiency and recyclability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Product Highlight Strip */}
            <section className="highlight-strip">
                <div className="highlight-content">
                    <h2>Browse Ready–to–Ship AAC Blocks</h2>
                    <p>
                        Filter by size, density, and application type. Check live stock and transparent pricing.
                    </p>
                </div>
                <button className="btn-strip" onClick={handleShopNow}>
                    View Products →
                </button>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2 className="section-title">How BlockFlow Works</h2>
                <p className="section-subtitle">
                    Simple 3–step process from selection to delivery at your site.
                </p>

                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <h3>Search & Compare</h3>
                        <p>
                            Use our advanced search and filters to find the perfect AAC blocks for your project.
                        </p>
                    </div>

                    <div className="step-card">
                        <span className="step-number">2</span>
                        <h3>Get Live Pricing</h3>
                        <p>
                            See per–unit and bulk pricing instantly, with clear delivery estimates.
                        </p>
                    </div>

                    <div className="step-card">
                        <span className="step-number">3</span>
                        <h3>Place Order & Track</h3>
                        <p>
                            Confirm your order and track dispatch from factory to construction site.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials / Trust Section */}
            <section className="trust-section">
                <h2 className="section-title">Trusted by Builders & Contractors</h2>
                <p className="section-subtitle">
                    From residential homes to large commercial sites, our AAC blocks power real projects.
                </p>

                <div className="trust-grid">
                    <div className="trust-card">
                        <p>
                            “We reduced project timelines by almost 25% after switching to these AAC blocks.
                            Quality and delivery have been consistently reliable.”
                        </p>
                        <span className="trust-author">— Site Engineer, Pune</span>
                    </div>
                    <div className="trust-card">
                        <p>
                            “The dimensional accuracy is excellent. Less wastage on site and easier for masons
                            to work with.”
                        </p>
                        <span className="trust-author">— Contractor, Ahmedabad</span>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Build with AAC?</h2>
                    <p>
                        Start exploring products now or talk to our team for bulk inquiries and project–based pricing.
                    </p>
                </div>
                <div className="cta-actions">
                    <button className="btn-primary" onClick={handleShopNow}>
                        Start Browsing Products
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-brand">BlockFlow • AAC Block Platform</div>
                <div className="footer-links">
                    <span>© {new Date().getFullYear()} BlockFlow. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
