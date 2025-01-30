import Contact from '../models/Contact.js'; // Make sure to include the .js extension

// Create a new contact
const createContact = async (req, res) => {
    try {
        const { name, phone, date, time, comments } = req.body;
        const newContact = new Contact({
            name,
            phone,
            date,
            time,
            comments,
        });
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully', contact: newContact });
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error: error.message });
        console.error(error);
    }
};

// Get all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
         res.status(500).json({ message: 'Error fetching contacts', error: error.message });
         console.error(error);
    }
};

// Get a single contact
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "contact not found" });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contact", error: error.message });
        console.error(error);
    }
};

// Update a contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact updated successfully', contact });
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error: error.message });
        console.error(error)
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
        console.error(error);
    }
};

export { createContact, getAllContacts, getContact, updateContact, deleteContact };