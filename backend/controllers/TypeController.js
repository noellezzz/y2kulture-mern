import Type from "../models/Type.js"
import mongoose from 'mongoose'

export const getType = async (request, response) => {
    try {
        const type = await Type.find({});
        response.status(200).json({ success: true, message: "Types Retrieved.", data: type });
    } catch (error) {
        console.log("Error in fetching types: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const getOneType = async (request, response) => {
    try {
        const { id } = request.params;
        const type = await Type.findById(id);
        response.status(200).json({ success: true, message: "Type Retrieved.", data: type });
    } catch (error) {
        console.log("Error in fetching Type: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const createType = async (request, response) => {
    const type = request.body;
    
    if(!type.title || !type.description) {
        return response.status(400).json({ success:false, message:"Please provide all fields."});
    }

    const newType = new Type(type);

    try {
        await newType.save();
        response.status(201).json({ success:true, data: newType, message: "Type created Successfully!"});
    } catch (error) {
        console.error("Error in Create Type:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Type."});
    }
}

export const updateType = async (request, response) => {
    const { id } = request.params;

    const type = request.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success:false, message: "Invalid Type ID" });
    }

    try {
        const updatedType = await Type.findByIdAndUpdate(id, type, {new:true});
        response.status(200).json({ success:true, data:updatedType });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Type."})
    }
}

export const deleteType = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Type.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Type not Found.'});
        }

        response.status(200).json({ success: true, message: "Type Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Type." })
    }
}