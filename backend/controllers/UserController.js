import User from "../models/User.js"
import Product from "../models/Product.js";
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import { request } from "express";

export const getUser = async (request, response) => {
    try {
        const user = await User.find({})
        .populate({
            path: 'cart.productId', 
            model: 'Product' 
        });
        response.status(200).json({ success: true, message: "Users Retrieved.", data: user });
    } catch (error) {
        console.log("Error in fetching Users: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
};

export const getOneUser = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await User.findById(id).populate({
            path: 'cart.productId', 
            model: 'Product' 
        });;
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
    const { userId } = req.params; 
    const { productId, quantity, stockId, color, size } = req.body;

    if (!productId || !quantity || !stockId ) {
        return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingCartItem = user.cart.find(item => item.stockId.toString() === stockId);

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            user.cart.push({ productId, stockId, quantity, color, size });
        }

        await user.save();

        res.status(200).json({ message: "Product added to cart successfully.", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product to cart", error });
    }
};

export const addToCheckout = async (req, res) => {
    const { userId } = req.params;
    const { items, status, datePlaced } = req.body;
    const cartItemIds = items.map(item => item.cartItemId);

    if (!userId || !items || !items.length) {
        return res.status(400).json({ message: "User ID and items array are required." });
    }

    for (let item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
        }

        const stockItem = product.stock.find(
            (stock) => stock._id.toString() === item.stockId && stock.color === item.color && stock.size === item.size
        );

        if (!stockItem) {
            return res.status(404).json({ message: `Stock with ID ${item.stockId} not found for product ${item.productId}.` });
        }

        if (item.quantity > stockItem.quantity) {
            return res.status(400).json({ 
                message: `Insufficient stock for ${product.title} (Color: ${item.color}, Size: ${item.size}). Available: ${stockItem.quantity}, Requested: ${item.quantity}.` 
            });
        }
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const newOrder = {
            order: {
                items: items.map(item => ({
                    productId: item.productId,
                    stockId: item.stockId,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                })),
                status: status || 'Pending',
                datePlaced: datePlaced || new Date(),
                dateShipped: null, 
                dateDelivered: null 
            }
        };

        user.checkout.push(newOrder);
        user.cart = user.cart.filter(cartItem => !cartItemIds.includes(cartItem._id.toString()));

        await user.save();

        res.status(200).json({ message: "Checkout added successfully.", checkout: user.checkout });
    } catch (error) {
        res.status(500).json({ message: "Failed to add to checkout", error });
    }
};
