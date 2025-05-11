import React, { useEffect, useState } from 'react';
import { get, post } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewProducts.css';

const ViewProductsUser = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await get('/api/products');
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
    };

    const handleAddToCart = async (productId) => {
        try {
            await post('/api/cart', { productId });
            toast.success("Added to cart successfully");
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error("Failed to add to cart");
        }
    };

    return (
        <div className="product-grid-container">
            {products.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
};

const ProductCard = ({ product, onClick, onAddToCart }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let intervalId;
        const imageCount = product.images ? product.images.length : 0;

        if (imageCount > 1) {
            intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageCount);
            }, 3000);
        }

        return () => clearInterval(intervalId);
    }, [product.images]);

    return (
        <div className="product-card">
            <div className="product-image-container" onClick={() => onClick(product._id)}>
                {product.images && product.images.length > 0 ? (
                    <img
                        src={`http://localhost:4000${product.images[currentImageIndex]}`}
                        alt={product.name}
                        className="product-image"
                    />
                ) : product.image ? (
                    <img
                        src={`http://localhost:4000${product.image}`}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="product-image-placeholder">No Image</div>
                )}
            </div>

            <div className="product-infos">
                <div className="product-name">{product.name}</div>
                <div className="product-category">{product.category}</div>
            </div>

            <div className="product-actions">
                <button
                    className="edit-button"
                    onClick={() => onAddToCart(product._id)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ViewProductsUser;
