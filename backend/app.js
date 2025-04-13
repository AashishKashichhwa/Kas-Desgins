// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); // Import routes
const adminRoutes = require('./routes/AdminRoutes'); // Import AdminRoutes  <-- ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);
app.use('/api/admin', adminRoutes);  // Mount AdminRoutes under /api/admin   <-- ADD THIS

module.exports = app;