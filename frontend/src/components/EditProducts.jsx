import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../assets/styles/AddProducts.css'; // Reuse existing styles
import '../assets/styles/EditProduct.css'; // Optional specific styles
import { get } from '../services/ApiEndpoint';

const EditProducts = ({ fetchProducts }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [imageFields, setImageFields] = useState([0]);
    const [product3DVisualization, setProduct3DVisualization] = useState('');
    const currentId = useRef(1); // UseRef to preserve value across renders

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await get(`/api/products/${id}`);
                const data = res.data;
                if (res.status === 200) {
                    setProductName(data.name);
                    setProductDescription(data.description);
                    setCategory(data.category);
                    setPrice(data.price);
                    setProduct3DVisualization(data.product3DVisualization);

                    if (data.images && data.images.length > 0) {
                        setExistingImages(data.images);
                    } else if (data.image) {
                        setExistingImages([data.image]);
                    } else {
                        setExistingImages([]);
                    }

                    setImageFields([0]);
                    currentId.current = 1;
                } else {
                    toast.error('Failed to fetch product.');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load product.');
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('category', category);
            formData.append('price', price);
            formData.append('product3DVisualization', product3DVisualization);

            let newFilesSelected = false;
            imageFields.forEach((fieldId) => {
                const fileInput = document.getElementById(`productImage-${fieldId}`);
                if (fileInput && fileInput.files.length > 0) {
                    newFilesSelected = true;
                    Array.from(fileInput.files).forEach(file =>
                        formData.append('images', file)
                    );
                }
            });

            formData.append('replaceImages', newFilesSelected ? 'true' : 'false');

            const res = await axios.put(`http://localhost:4000/api/products/${id}`, formData);

            if (res.status === 200) {
                toast.success(res.data.message || 'Product updated successfully!');
                if (fetchProducts) fetchProducts();
                navigate('/admin/products');
            } else {
                toast.error(res.data.message || 'Failed to update product.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error updating product');
        }
    };

    const handleAddImageField = () => {
        setImageFields(prev => [...prev, currentId.current++]);
    };

    return (
        <div className="add-product-container edit-product-container">
            <h2 className="add-product-title">Edit Product</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="add-product-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className="add-product-input"
                    />
                </div>

                <div className="add-product-group">
                    <label htmlFor="productDescription">Product Description:</label>
                    <textarea
                        id="productDescription"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                        className="add-product-textarea"
                    />
                </div>

                <div className="add-product-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="add-product-input"
                    />
                </div>

                <div className="add-product-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="add-product-input"
                    />
                </div>

                {existingImages.length > 0 && (
                    <div className="add-product-group existing-images-preview">
                        <label>Current Image(s):</label>
                        <div className="image-preview-container">
                            {existingImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:4000${imgUrl}`}
                                    alt={`Current product ${index + 1}`}
                                    className="current-product-image-preview"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="add-product-group">
                    <label>
                        {existingImages.length > 0 ? 'Replace Image(s) with New Files:' : 'Upload Image(s):'}
                    </label>
                    {imageFields.map((fieldId) => (
                        <input
                            key={fieldId}
                            type="file"
                            id={`productImage-${fieldId}`}
                            accept="image/*"
                            className="add-product-input"
                            multiple
                        />
                    ))}
                    <button type="button" className="add-image-button" onClick={handleAddImageField}>
                        + Add more file inputs
                    </button>
                </div>

                <div className="add-product-group">
                    <label htmlFor="product3DVisualization">3D Visualization (Iframe Code):</label>
                    <textarea
                        id="product3DVisualization"
                        value={product3DVisualization}
                        onChange={(e) => setProduct3DVisualization(e.target.value)}
                        className="add-product-textarea"
                    />
                </div>

                <button type="submit" className="add-product-button">Update Product</button>
            </form>
        </div>
    );
};

export default EditProducts;
