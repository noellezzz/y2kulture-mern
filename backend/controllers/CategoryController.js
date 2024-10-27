import Category from "../models/Category.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'

export const getCategory = async (request, response) => {
    try {
        const category = await Category.find({})
            .populate('clothing_type')
            .exec();

        response.status(200).json({
            success: true,
            message: "Categories Retrieved.",
            data: category
        });
    } catch (error) {
        console.log("Error in fetching Categories: ", error.message);
        response.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const getOneCategory = async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findById(id)
        .populate('clothing_type')
        .exec();
        
        response.status(200).json({ success: true, message: "Category Retrieved.", data: category });
    } catch (error) {
        console.log("Error in fetching Category: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const createCategory = async (request, response) => {
    const category = request.body;

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
    
    if(!category.title || !category.description || !category.clothing_type) {
        return response.status(400).json({ success:false, message:"Please provide all fields."});
    }

    const newCategory = new Category(category);

    try {
        await newCategory.save();
        response.status(201).json({ success:true, data: newCategory, message: "Category created Successfully!"});
    } catch (error) {
        console.error("Error in Create Category:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Category."});
    }
}

export const updateCategory = async (request, response) => {
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

    const category = request.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success:false, message: "Invalid Category ID" });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, category, {new:true});
        response.status(200).json({ success:true, data:updatedCategory });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Category."})
    }
}

export const deleteCategory = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Category.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Category not Found.'});
        }

        response.status(200).json({ success: true, message: "Category Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Category." })
    }
}