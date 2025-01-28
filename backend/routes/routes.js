// server/routes/routes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const contactController = require('../controllers/contactController');

// Project Routes
router.get('/projects', projectController.getProjects);
router.post('/projects', projectController.addProject);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', projectController.updateProjectById);
router.delete('/projects/:id', projectController.deleteProjectById);

// Contact Routes
router.get('/contacts', contactController.getContacts);
router.post('/contacts', contactController.addContact);


module.exports = router;