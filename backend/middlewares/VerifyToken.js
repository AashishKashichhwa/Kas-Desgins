import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        // console.log(token)

        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Unauthorized: You are not an admin' })
        }
        req.user = user
        next()

        // console.log(user)
    } catch (error) {
        console.log(error)
    }
}

const isUser=async(req,res,next)=>{
    try {
       const token=req.cookies.token
       if (!token) {
          return res.status(401).json({messsage:"'Unauthorized: No token provided'"})
       }
 
       const decoded= jwt.verify(token,process.env.JWT_SECRET)
       const user=await UserModel.findById(decoded.userId)
       if (!user) {
          return res.status(401).json({messsage:"'User not found'"})
       }
 
     
     req.user=user
       next()
    
  } catch (error) {
      console.log(error)
  }
 }
 

export { isAdmin, isUser }  // export the middleware functions