

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
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'  
}));


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