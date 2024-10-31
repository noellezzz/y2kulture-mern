import User from "../models/User.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import { request } from "express";

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

    // let images = []
    // if (typeof request.body.avatar === 'string') {
    //     images.push(request.body.avatar)
    // } else {
    //     images = request.body.avatar
    // }

    // let imagesLinks = [];
    // for (let i = 0; i < images.length; i++) {
    //     try {
    //         const result = await cloudinary.v2.uploader.upload(images[i], {
    //             folder: 'products',
    //             width: 500,
    //             height: 500,
    //             crop: "scale",
    //         });

    //         imagesLinks.push({
    //             public_id: result.public_id,
    //             url: result.secure_url
    //         })

    //     } catch (error) {
    //         console.log("Cant Upload", error)
    //     }
    // }

    // request.body.avatar = imagesLinks
    
    if( !user.email || !user.password) {
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

    let images = []
    // console.log('before', request.body.avatar)
    if (Array.isArray(request.body.avatar)) {
        if (typeof request.body.avatar[0] === 'string') {
            
            images = request.body.avatar;
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                try {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: 'users',
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
            request.body.avatar = imagesLinks
        } else if (typeof request.body.avatar[0] === 'object') {
            
        }
    } else if (typeof request.body.avatar === 'string') {
        console.log('detected')
        images.push(request.body.avatar);
    }

    // console.log('after', request.body.avatar)
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

export const addToCart = async (req, res) => {
    const { userId } = req.params; // Changed 'id' to 'userId' for clarity
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the product is already in the cart
        const existingCartItem = user.cart.find(item => item.productId.toString() === productId);

        if (existingCartItem) {
            // If it exists, update the quantity
            existingCartItem.quantity += quantity;
        } else {
            // If it doesn't exist, add a new item to the cart
            user.cart.push({ productId, quantity });
        }

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Product added to cart successfully.", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product to cart", error });
    }
};