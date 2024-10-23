import User from "../models/User.js"
import mongoose from 'mongoose'

export const getUser = async (request, response) => {
    try {
        const user = await User.find({});
        response.status(200).json({ success: true, message: "Users Retrieved.", data: user });
    } catch (error) {
        console.log("Error in fetching Users: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const getOneUser = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await User.findById(id);
        response.status(200).json({ success: true, message: "User Retrieved.", data: user });
    } catch (error) {
        console.log("Error in fetching User: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const createUser = async (request, response) => {
    const user = request.body;
    
    if( !user.email || !user.password || !user.status || !user.role) {
        return response.status(400).json({ success:false, message:"Please provide all fields."});
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        response.status(201).json({ success:true, data: newUser, message: "User created Successfully!"});
    } catch (error) {
        console.error("Error in Create User:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating User."});
    }
}

export const updateUser = async (request, response) => {
    const { id } = request.params;

    const user = request.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success:false, message: "Invalid User ID" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new:true});
        response.status(200).json({ success:true, data:updatedUser });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating User."})
    }
}

export const deleteUser = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'User not Found.'});
        }

        response.status(200).json({ success: true, message: "User Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting User." })
    }
}