import UserModel from "../models/user.js";
import bcryptjs from 'bcryptjs'
const register = async(req, res) => {
    try{
        const {name, email, password} = req.body;
        const existUser = await UserModel.findOne({email})
        if(existUser){
            return res.status(400).json({success:false,message: 'User already exist'})
        }
        const hashedPassword = await bcryptjs.hashSync(password, 10)
        const newUser = new UserModel({
            name, email, password:hashedPassword
        })
        await newUser.save()
        res.status(200).json({message:"User register successfully",newUser})
    }catch (error){
        res.status(500).json({message: 'Internal server error'})
        console.error(error)
    }
}

export {register}