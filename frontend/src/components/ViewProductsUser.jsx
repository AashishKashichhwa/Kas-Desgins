import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ViewProductsUser.css'; // New CSS File
import AddToCart from './AddToCart';

const ViewProductsUser = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
    };

     const handleAddToCart = (productId) => {
         console.log(`Adding product ${productId} to cart`);
     };

    return (
        <div className="product-grid-container">
            {products.map(product => (
                <div className="product-card" key={product._id}>
                    <div className="product-image-container" onClick={() => handleProductClick(product._id)}>
                        {product.images && product.images.length > 0 ? (
                            <img src={`http://localhost:4000${product.images[0]}`} alt={product.name} className="product-image" />
                        ) : (
                            <div className="product-image-placeholder">No Image</div>
                        )}
                    </div>
                    <div className="product-infos">
                        <div className="product-name">{product.name}</div>
                        <div className="product-category">Price: ${product.price}</div>
                        <AddToCart productId={product._id} onAddToCart={handleAddToCart} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewProductsUser;