import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../assets/styles/AddProducts.css'; // Ensure this file exists and styles your form
import { useNavigate } from 'react-router-dom';

const AddProducts = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageFields, setImageFields] = useState([0]);
    const [stock, setStock] = useState('');
    const [product3DVisualization, setProduct3DVisualization] = useState('');
    const navigate = useNavigate();

    let currentId = 1; // We will use this to generate unique field IDs

// AddProducts Component
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('price', productPrice);
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('product3DVisualization', product3DVisualization); // Ensure this field is set properly

        // Handle images dynamically
        imageFields.forEach((fieldId) => {
            const fileInput = document.getElementById(`productImage-${fieldId}`);
            if (fileInput && fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach(file => formData.append('images', file));
            }
        });

        const res = await axios.post('http://localhost:4000/api/products/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res.status === 201) {
            toast.success(res.data.message);
            // Reset the form fields after a successful submission
            setProductName('');
            setProductDescription('');
            setProductPrice('');
            setCategory('');
            setImageFields([0]); // Reset the image fields
            setStock('');
            setProduct3DVisualization(''); // Reset the 3D visualization input
            navigate('/admin/products');
        } else {
            toast.error('Failed to add product.');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Error adding product');
    }
};


    const handleAddImageField = () => {
        setImageFields((prevFields) => [...prevFields, currentId++]);
    };

    return (
        <div className="add-product-container">
            <h2 className="add-product-title">Add New Product</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="add-product-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required className="add-product-input" />
                </div>
                <div className="add-product-group">
                    <label htmlFor="productDescription">Product Description:</label>
                    <textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required className="add-product-textarea" />
                </div>
                <div className="add-product-group">
                    <label htmlFor="productPrice">Product Price:</label>
                    <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required className="add-product-input" />
                </div>
                <div className="add-product-group">
                    <label htmlFor="productCategory">Category:</label>
                    <input type="text" id="productCategory" value={category} onChange={(e) => setCategory(e.target.value)} className="add-product-input" />
                </div>
                <div className="add-product-group">
                    <label htmlFor="productStock">Stock:</label>
                    <input type="number" id="productStock" value={stock} onChange={(e) => setStock(e.target.value)} className="add-product-input" />
                </div>
                <div className="add-product-group">
                    <label>Product Images:</label>
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
                    <button type="button" className="add-image-button" onClick={handleAddImageField}>+ Add more</button>
                </div>
                <div className="add-product-group">
                    <label htmlFor="product3DVisualization">Product 3D Visualization (Iframe Code):</label>
                    <textarea id="product3DVisualization" value={product3DVisualization} onChange={(e) => setProduct3DVisualization(e.target.value)} className="add-product-textarea" />
                </div>
                <button type="submit" className="add-product-button">Add Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
