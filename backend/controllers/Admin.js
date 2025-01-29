import UserModel from "../models/user.js"

const getUser = async(req, res) => {
    try{
        // res.send("Hello  Admin")
        // console.log("Hello from Admin")
        const users = await UserModel.find()
        res.status(200).json({users})
    }catch(error){
        res.status(500).json({message: "Internal server error"})
        console.log(error)
    }
}

export default getUser