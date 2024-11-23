export const getProduct = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 12;
        const skip = (page - 1) * limit;

        const categoryTypes = [].concat(request.query.categoryType || []);
        const genders = [].concat(request.query.gender || []);

        let query = {};

        if (categoryTypes.length > 0 || genders.length > 0) {
            // Find Types that match the requested genders
            const matchingTypes = await mongoose.model('Type').find({
                title: { $in: genders }
            }).select('_id');

            const typeIds = matchingTypes.map(type => type._id);

            // Find Categories that reference these Types and match the selected category types
            const categoryQuery = await Category.find({
                title: { $in: categoryTypes },
                clothing_type: { $in: typeIds }
            }).select('_id');

            if (categoryQuery.length > 0) {
                query.category = { $in: categoryQuery.map(cat => cat._id) };
            } else {
                return response.status(200).json({
                    success: true,
                    message: "No products found for the selected filters.",
                    data: [],
                    currentPage: page,
                    totalPages: 0,
                    hasMore: false
                });
            }
        }

        const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate({
                path: 'category',
                populate: {
                    path: 'clothing_type',
                    model: 'Type'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        response.status(200).json({ 
            success: true, 
            message: products.length ? "Products Retrieved." : "No products found for the selected filters.",
            data: products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            hasMore: page * limit < totalProducts
        });
    } catch (error) {
        console.log("Error in fetching products: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};import Type from "../models/Type.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'

export const getType = async (request, response) => {
    try {
        const type = await Type.find({}).sort({ createdAt: -1 });
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
                folder: 'clothing_type',
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