import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    product3DVisualization: {
        type: String,
        default: '',
    },
    images: [{
        type: String, // Array of image URLs or paths
    }]
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
