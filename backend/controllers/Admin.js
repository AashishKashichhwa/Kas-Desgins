// backend/controllers/Admin.js
import UserModel from "../models/User.js";

const getUser = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const checkAdmin = await UserModel.findById(userId);
        if (checkAdmin.role === 'admin') {
            return res.status(400).json({ message: "You can't delete admin" });
        }

        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json({ message: "User deleted successfully", user });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role } = req.body;  // <--- Include role

        console.log("Updating user:", userId, "with data:", { name, email, role });

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email, role },  // <--- Include role in the update
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

export { getUser, deleteUser, getUserById, updateUser };  // Include updateUser in the export