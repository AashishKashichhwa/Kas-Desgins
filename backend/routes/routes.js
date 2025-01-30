import express from 'express';
const router = express.Router();
import { createContact, getAllContacts, getContact, updateContact, deleteContact } from '../controllers/contactController.js'

router.post('/contact', createContact);
router.get('/contact', getAllContacts);
router.get('/contact/:id', getContact);
router.put('/contact/:id', updateContact);
router.delete('/contact/:id', deleteContact);

export default router;