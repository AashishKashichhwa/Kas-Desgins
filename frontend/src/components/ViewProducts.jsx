import React, { useEffect, useState } from 'react';
import { get, deleteUser } from '../services/ApiEndpoint';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewProducts.css';

const ViewProducts = () => {
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
        navigate(`/admin/products/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(`/api/products/${id}`);
            toast.success("Product deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error("Error deleting product");
        }
    };

    return (
        <div className="product-grid-container">
            {products.map(product => (
                <ProductCard key={product._id} product={product} onClick={handleProductClick} handleDelete={handleDelete} />
            ))}
        </div>
    );
};

const ProductCard = ({ product, onClick, handleDelete }) => {
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
            <div className="product-actions">
                <Link to={`/admin/edit-product/${product._id}`} className="edit-button">Edit</Link>
                <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
            </div>

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
        </div>
    );
};

export default ViewProducts;
