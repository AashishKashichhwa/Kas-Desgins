import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'

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

export default isAdmin