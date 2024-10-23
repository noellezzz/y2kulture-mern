import Promo from "../models/Promo.js"
import mongoose from 'mongoose'

export const getPromo = async (request, response) => {
    try {
        const promo = await Promo.find({})
            .populate('promo_for')
            .exec();

        response.status(200).json({
            success: true,
            message: "Promos Retrieved.",
            data: promo
        });
    } catch (error) {
        console.log("Error in fetching Promos: ", error.message);
        response.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const getOnePromo = async (request, response) => {
    try {
        const { id } = request.params;
        const promo = await Promo.findById(id)
        .populate('promo_for')
        .exec();
        
        response.status(200).json({ success: true, message: "Promo Retrieved.", data: promo });
    } catch (error) {
        console.log("Error in fetching Promo: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const createPromo = async (request, response) => {
    const promo = request.body;
    
    if(!promo.title || !promo.description || !promo.promo_for) {
        return response.status(400).json({ success:false, message:"Please provide all fields."});
    }

    const newPromo = new Promo(promo);

    try {
        await newPromo.save();
        response.status(201).json({ success:true, data: newPromo, message: "Promo created Successfully!"});
    } catch (error) {
        console.error("Error in Create Promo:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Promo."});
    }
}

export const updatePromo = async (request, response) => {
    const { id } = request.params;

    const promo = request.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success:false, message: "Invalid Promo ID" });
    }

    try {
        const updatedPromo = await Promo.findByIdAndUpdate(id, promo, {new:true});
        response.status(200).json({ success:true, data: updatedPromo });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Promo."})
    }
}

export const deletePromo = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Promo.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Promo not Found.'});
        }

        response.status(200).json({ success: true, message: "Promo Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Promo." })
    }
}