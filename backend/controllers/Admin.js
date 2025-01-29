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

const deleteUser = async(req, res) => {
    try{
        const userId = req.params.id
        
        const checkAdmin = await UserModel.findById(userId)
        if(checkAdmin.role == 'admin'){
            return res.status(400).json({message: "You can't delete admin"})
        }

        const user = await UserModel.findByIdAndDelete(userId)
        if(!user){
            res.status(404).json({message: "User not found"})
            }else{
                res.status(200).json({message: "User deleted successfully", user})
        }
    }catch(error){
        res.status(500).json({message: "Internal server error"})
        console.log(error)
    }
}

export  {getUser, deleteUser}