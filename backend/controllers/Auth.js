import UserModel from "../models/user.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await UserModel.findOne({ email })
        if (existUser) {
            return res.status(400).json({ success: false, message: 'User already exist' })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new UserModel({
            name, email, password: hashedPassword
        })
        await newUser.save()
        res.status(200).json({ message: "User register successfully", newUser })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
        console.error(error)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        const isValidPassword = await bcryptjs.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: 'Invalid password' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge: 60 * 60 * 1000


        })
        res.status(200).json({sucess: true, message: 'User login successfully', user,token})
    } catch (error) {
        res.status(500).json({sucess: false, message: 'Internal server error' })
        console.error(error)
    }

}

export { register, login }