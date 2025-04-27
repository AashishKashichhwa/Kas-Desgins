import Product from '../models/Products.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

// Add a new product
// Add a new product
const addProducts = async (req, res) => {
    try {
        const { name, description, price, category, stock, product3DVisualization } = req.body;

        // Process the uploaded image files
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => path.join('/uploads', file.filename)); // Cross-platform safe path construction
        }

        const newProduct = new Product({
            name,
            description,
            price,
            images: imagePaths,
            category,
            stock,
            product3DVisualization, // Make sure 3D visualization is set correctly
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error in addProduct:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};


// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(`Error fetching product by ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update product by ID
const updateProductsById = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, stock, product3DVisualization, replaceImages } = req.body;
        const productToUpdate = await Product.findById(productId);

        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let imagePaths = productToUpdate.images || [];
        const shouldReplaceImages = replaceImages === 'true' && req.files && req.files.length > 0;

        if (shouldReplaceImages) {
            if (productToUpdate.images && productToUpdate.images.length > 0) {
                productToUpdate.images.forEach(imgPath => {
                    try {
                        const fullPath = path.join(__dirname, imgPath);
                        if (fs.existsSync(fullPath)) {
                            fs.unlinkSync(fullPath);
                        }
                    } catch (unlinkErr) {
                        console.error(`Error deleting old image:`, unlinkErr);
                    }
                });
            }
            imagePaths = req.files.map(file => path.join('/uploads', file.filename));
        }

        const parsedPrice = price !== undefined ? Number(price) : undefined;
        const parsedStock = stock !== undefined ? Number(stock) : undefined;

        const updateData = {
            name: name !== undefined ? name : productToUpdate.name,
            description: description !== undefined ? description : productToUpdate.description,
            price: parsedPrice !== undefined ? parsedPrice : productToUpdate.price,
            category: category !== undefined ? category : productToUpdate.category,
            stock: parsedStock !== undefined ? parsedStock : productToUpdate.stock,
            images: imagePaths,
            product3DVisualization: product3DVisualization !== undefined ? product3DVisualization : productToUpdate.product3DVisualization,
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found after update attempt' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(`Error updating product:`, error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};


// Delete product by ID
const deleteProductsById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId); // Find first to get image paths

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete associated image files from the server (best practice)
        if (product.images && product.images.length > 0) {
            product.images.forEach(imgPath => {
                try {
                    const fullPath = path.join(__dirname, imgPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted image on product delete: ${fullPath}`);
                    } else {
                        console.warn(`Image not found on product delete, skipping: ${fullPath}`);
                    }
                } catch (unlinkErr) {
                    console.error(`Error deleting image ${imgPath} during product delete:`, unlinkErr);
                }
            });
        }

        // If the product has a 3D visualization model, we might also want to remove it (if needed)
        if (product.product3DVisualization) {
            const fullPath3D = path.join(__dirname, product.product3DVisualization);
            if (fs.existsSync(fullPath3D)) {
                fs.unlinkSync(fullPath3D);
                console.log(`Deleted 3D visualization model: ${fullPath3D}`);
            }
        }

        // Delete the product document from the database
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(`Error deleting product ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

export {
    getProducts,
    addProducts,
    getProductById,
    updateProductsById,
    deleteProductsById
};
