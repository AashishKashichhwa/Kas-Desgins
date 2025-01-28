// server/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes/routes'); // Import routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

module.exports = app;