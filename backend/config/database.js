// // config/database.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//      await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected...");
   
//   } catch (error) {
//      console.log('Error connecting to MongoDB:', error.message);
//   }
// };

// module.exports = connectDB;