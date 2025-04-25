import React from 'react';
import AdminSidebar from './AdminSidebar';
import ViewProducts from './ViewProducts';
import { Link } from 'react-router-dom';
import '../assets/styles/AdminHome.css';
import '../assets/styles/ManageProducts.css'; // New CSS for ManageProducts

const ManageProducts = () => {
    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                    <div className="manage-products-header">
                        <h2>Manage Products</h2>
                        <Link to="/admin/add-product">
                            <button className="add-product-button">Add Product</button>
                        </Link>
                    </div>
                    <ViewProducts />
                </div>
            </main>
        </div>
    );
};

export default ManageProducts;