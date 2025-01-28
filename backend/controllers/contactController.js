// server/controllers/contactController.js
const Contact = require('../models/Contact');

 exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
         res.json(contacts);
     } catch (error) {
         res.status(500).json({ message: error.message });
     }
  };

 exports.addContact = async (req, res) => {
       const contact = new Contact(req.body);
       try {
           const newContact = await contact.save();
            res.status(201).json(newContact);
         } catch (error) {
             res.status(400).json({ message: error.message });
           }
    };