import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
     time: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;