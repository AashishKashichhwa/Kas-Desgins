import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../services/ApiEndpoint';
import '../assets/styles/ViewProductsById.css';

const ViewProductsByIdUsers = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate(); // <-- initialize navigate

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await get(`/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Error fetching product by ID:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const goToPrevious = () => {
        setCurrentImageIndex(prevIndex =>
            product.images
                ? (prevIndex - 1 + product.images.length) % product.images.length
                : 0
        );
    };

    const goToNext = () => {
        setCurrentImageIndex(prevIndex =>
            product.images
                ? (prevIndex + 1) % product.images.length
                : 0
        );
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div className="product-details-container">
            <div className="product-details-contents">
                                  {/* Cross Button */}
            <button className="close-button" onClick={() => navigate('/products')}>×</button>
                <h2 className="product-detail-title">{product.name}</h2>
                <div className="product-details-content">
                    <div className="product-info">
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        {product.price && <p><strong>Price:</strong> ${product.price}</p>}
                    </div>

                    {product.images && product.images.length > 0 ? (
                        <div className="product-image-gallery">
                            <h3>Images:</h3>
                            <div className="imagebox">
                                <button className="image-button back" onClick={goToPrevious}>‹</button>
                                <img
                                    src={`http://localhost:4000${product.images[currentImageIndex]}`}
                                    alt={`${product.name} - ${currentImageIndex + 1}`}
                                    className="product-gallery-image"
                                />
                                <button className="image-button next" onClick={goToNext}>›</button>
                            </div>
                        </div>
                    ) : product.image ? (
                        <div className="product-image-gallery">
                            <h3>Image:</h3>
                            <img
                                src={`http://localhost:4000${product.image}`}
                                alt={product.name}
                                className="product-gallery-image"
                            />
                        </div>
                    ) : (
                        <h1>No Images</h1>
                    )}
                </div>

                {product.product3DVisualization && (
                    <div className="product-3d-visualization">
                        <h3>3D Visualization:</h3>
                        <div
                            className="product-iframe-container"
                            dangerouslySetInnerHTML={{ __html: product.product3DVisualization }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewProductsByIdUsers;
