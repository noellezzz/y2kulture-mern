import Promo from "../models/Promo.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'

export const getPromo = async (request, response) => {
    try {
        const promo = await Promo.find({})
            .populate('promo_for')
            .sort({ createdAt: -1 })
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
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const createPromo = async (request, response) => {
    const promo = request.body;

    if (!promo.title || !promo.description || !promo.promo_for || !promo.voucher_code || !promo.discount) {
        return response.status(400).json({ success: false, message: "Please provide all fields." });
    }

    let images = []
    if (typeof request.body.images === 'string') {
        images.push(request.body.images)
    } else {
        images = request.body.images
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'promos',
                width: 500,
                height: 500,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log("Cant Upload", error)
        }

    }

    request.body.images = imagesLinks

    const newPromo = new Promo(promo);

    try {
        await newPromo.save();
        response.status(201).json({ success: true, data: newPromo, message: "Promo created Successfully!" });
    } catch (error) {
        console.error("Error in Create Promo:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Promo." });
    }
}

export const updatePromo = async (request, response) => {
    const { id } = request.params;

    let images = []
    if (Array.isArray(request.body.images)) {
        if (typeof request.body.images[0] === 'string') {
            images = request.body.images;
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                try {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: 'products',
                        width: 500,
                        height: 500,
                        crop: "scale",
                    });

                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    })

                } catch (error) {
                    console.log("Cant Upload", error)
                }

            }
            request.body.images = imagesLinks
        } else if (typeof request.body.images[0] === 'object') {

        }
    } else if (typeof request.body.images === 'string') {
        images.push(request.body.images);
    }

    const promo = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success: false, message: "Invalid Promo ID" });
    }

    try {
        const updatedPromo = await Promo.findByIdAndUpdate(id, promo, { new: true });
        response.status(200).json({ success: true, data: updatedPromo });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Promo." })
    }
}

export const deletePromo = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Promo.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Promo not Found.' });
        }

        response.status(200).json({ success: true, message: "Promo Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Promo." })
    }
}

export const findPromo = async (req, res) => {
    const { promoCode } = req.body; 

    try {
        const promo = await Promo.findOne({ voucher_code: promoCode });

        if (!promo) {
            return res.status(404).json({ success: false, message: "Promo code not found." });
        }

        res.status(200).json({ success: true, promo, message: "Promo Found." });
    } catch (e) {
        res.status(500).json({ success: false, message: "Server Error: Error in Finding Promo." });
    }
};
