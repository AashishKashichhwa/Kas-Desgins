// // server/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// const app = require('./app');


// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected...");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.log('Error connecting to MongoDB:', error.message);
//   }
// };

// startServer();

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import DbCon from './utlis/db.js'
import AuthRoutes from './routes/AuthRoutes.js'
import AdminRoutes from './routes/AdminRoutes.js'
dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

// mongo Db
DbCon()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', AuthRoutes)
app.use('/api/admin',AdminRoutes)

app.get('/', (req,res) => {
  res.send('Hello World!')
})

app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`)
  console.log('PORT:', process.env.PORT);
console.log('MONGODB_URL:', process.env.MONGODB_URL);

})