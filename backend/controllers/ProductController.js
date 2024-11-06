import Product from "../models/Product.js"
import User from "../models/User.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import express from "express";

export const getProduct = async (request, response) => {
    try {
        const product = await Product.find({})
            .populate({
                path: 'category',
                populate: {
                    path: 'clothing_type',
                    model: 'Type'
                }
            })
            .sort({ createdAt: -1 })
            .exec();
        response.status(200).json({ success: true, message: "Product Retrieved.", data: product });
    } catch (error) {
        console.log("Error in fetching products: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const getOneProduct = async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.findById(id)
            .populate('category')
            .exec();
        response.status(200).json({ success: true, message: "Product Retrieved.", data: product });
    } catch (error) {
        console.log("Error in fetching Product: ", error.message);
        response.status(500).json({ success: false, message: "Server Error." });
    }
};

export const createProduct = async (request, response) => {
    const product = request.body;

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

    if (!product.title || !product.description || !product.category || !product.price ) {
        return response.status(400).json({ success: false, message: "Please provide all fields." });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        const populatedProduct = await Product.findById(newProduct._id)
            .populate({
                path: 'category',
                populate: {
                    path: 'clothing_type',
                },
            });
        response.status(201).json({ success: true, data: populatedProduct, message: "Product created Successfully!" });
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Product." });
    }
}

export const updateProduct = async (request, response) => {
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

    const product = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        response.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Product." })
    }
}

export const deleteProduct = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Product not Found.' });
        }

        response.status(200).json({ success: true, message: "Product Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Product." })
    }
}

// Stock Controller 

export const createStock = async (req, res) => {
    const { productId } = req.params;
    const { color, size, quantity } = req.body;

    if (!color || !size || quantity === undefined) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingStock = product.stock.find(stock => stock.color === color && stock.size === size);

        if (existingStock) {

            existingStock.quantity = quantity;
            await product.save(); 

            return res.status(200).json({ message: "Stock quantity updated successfully", product });
        } else {
          
            product.stock.push({
                color,
                size,
                quantity,
            });

            await product.save(); 

            return res.status(201).json({ message: "New stock created successfully", product });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to create or update stock", error });
    }
};


export const deductStock = async (req, res) => {
    const { deductions } = req.body;  

    try {
       
        for (const { productId, stockId, deductQuantity } of deductions) {
            const product = await Product.findById(productId);
            
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found` });
            }

            const stock = product.stock.id(stockId);
            
            if (!stock) {
                return res.status(404).json({ message: `Stock with ID ${stockId} not found for Product ID ${productId}` });
            }

            if (stock.quantity < deductQuantity) {
                return res.status(400).json({ message: `Insufficient stock quantity for Stock ID ${stockId} in Product ID ${productId}` });
            }

            stock.quantity -= deductQuantity;  
            await product.save();  
        }

        res.status(200).json({ message: "All stock deductions processed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to deduct stock", error });
    }
};

export const deleteStock = async(req, res) => {
    const { productId, stockId } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $pull: { stock: { _id: stockId } }  
            },
            { new: true }  
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product or Stock not found" });
        }

        res.status(200).json({ message: "Stock deleted successfully", product: updatedProduct });
    } catch(error) {
        res.status(500).json({ message: "Error in deleting stock", error })
    }
}

export const checkUserOrders = async(req, res) => {
    try {
        const { userId, productId } = req.params
        const { review, rating } = req.body
        const reviewData = {
            userId,
            rating, 
            review
        };

        const product = await Product.findById(productId)
        const user = await User.findById(userId)

        let userHasProduct = false

        user.checkout.map((order) => {
            order.order.items.map((item) => {
                if(item.productId == productId) {
                    userHasProduct = true
                }
            })
        })

        if (!userHasProduct) {
            return res.status(200).json({ success: false, message:"User has not purchased this product.", userHasProduct })
        }

        return res.status(200).json({ success: true, message:"User has purchased this product.", userHasProduct })
    } catch(error) {
        return res.status(500).json({ message: "Error in checking user orders", error })
    }
}

export const checkIfReviewed = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const product = await Product.findById(productId);

        // Iterate using for loop to break early
        for (let review of product.reviews) {
            if (review.userId.toString() === userId) {
                return res.status(200).json({
                    success: false,
                    message: "User has already reviewed this product.",
                    review
                });
            }
        }

        // If no review is found, send this response
        return res.status(200).json({
            success: true,
            message: "User has not reviewed this product."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error in checking user reviews",
            error
        });
    }
};
export const addReview = async(req, res) => {
    try {
        const { userId, productId } = req.params
        const { review, rating } = req.body
        const reviewData = {
            userId,
            rating, 
            review
        };

        const product = await Product.findById(productId)
        const user = await User.findById(userId)

        let userHasProduct = false

        user.checkout.map((order) => {
            order.order.items.map((item) => {
                if(item.productId == productId) {
                    userHasProduct = true
                }
            })
        })

        if (!userHasProduct) {
            return res.status(404).json({ message:"User has not purchased this product.", userHasProduct })
        }

        product.reviews.map((review) => {
            if(review.userId == userId) {
                return res.status(404).json({ message:"User has already reviewed this product." })
            }
        })

        product.reviews.push(reviewData);
        await product.save();

        return res.status(200).json({ message:"Successfully added Review.", product })

    } catch(error) {
        // console.log("Error adding review", e)
        res.status(500).json({ message: "Error in adding Review", error })
    }
}

export const updateReview = async(req, res) => {
    try {
        const { userId, productId } = req.params
        const { review, rating } = req.body
        const reviewData = {
            userId,
            rating, 
            review
        };

        const newReview = review

        let reviewFound = false
        const product = await Product.findById(productId)
        product.reviews.map((review) => {
            if(review.userId == userId) {
                review.review = newReview
                review.rating = rating
                reviewFound = true
            }
        })

        if(reviewFound) {
            await product.save()
            return res.status(200).json({ message:"Successfully updated Review.", product })
        } else {
            return res.status(404).json({ message:"No Review Found." })
        }

    } catch(error) {
        res.status(500).json({ message: "Error in updating Review", error })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const reviewIndex = product.reviews.findIndex(review => review.userId.toString() === userId);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        product.reviews.splice(reviewIndex, 1);

        await product.save();

        return res.status(200).json({ message: "Review successfully deleted.", product });
        
    } catch (error) {
        return res.status(500).json({ message: "Error in deleting Review", error });
    }
};
