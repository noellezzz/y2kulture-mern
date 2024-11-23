import Product from "../models/Product.js"
import User from "../models/User.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
import express from "express";
import Category from '../models/Category.js';

export const getProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Handle category filter
        if (req.query.categoryType) {
            const categoryTypes = Array.isArray(req.query.categoryType)
                ? req.query.categoryType
                : [req.query.categoryType];
            filter.category = { $in: categoryTypes.map(id => new mongoose.Types.ObjectId(id)) };
        }

        // Handle type filter
        if (req.query.typeId) {
            const typeIds = Array.isArray(req.query.typeId)
                ? req.query.typeId
                : [req.query.typeId];
            
            // Find categories that have any of these types
            const categories = await Category.find({
                clothing_type: { 
                    $in: typeIds.map(id => new mongoose.Types.ObjectId(id))
                }
            });

            if (categories.length > 0) {
                const categoryIds = categories.map(cat => cat._id);
                if (filter.category) {
                    // If category filter exists, intersect with existing categories
                    filter.category.$in = filter.category.$in.filter(id => 
                        categoryIds.some(catId => catId.equals(id))
                    );
                } else {
                    // If no category filter, use all categories with these types
                    filter.category = { $in: categoryIds };
                }
            } else {
                // If no categories found with these types, return no results
                filter.category = { $in: [] };
            }
        }

        // Handle price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Handle sorting
        let sort = {};
        if (req.query.sortFields) {
            const sortFields = Array.isArray(req.query.sortFields)
                ? req.query.sortFields
                : [req.query.sortFields];

            const sortOptions = {};
            sortFields.forEach(field => {
                if (field === 'price_asc') sortOptions.price = 1;
                if (field === 'price_desc') sortOptions.price = -1;
                if (field === 'title_asc') sortOptions.title = 1;
                if (field === 'title_desc') sortOptions.title = -1;
            });

            sort = sortOptions;
        }

        // Execute query with filters, sorting, and pagination
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category')
            .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(filter);
        const pages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                pages,
                page,
                limit
            }
        });

    } catch (error) {
        console.error('Error in getProduct:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('category')
            .exec();
        res.status(200).json({ success: true, message: "Product Retrieved.", data: product });
    } catch (error) {
        console.log("Error in fetching Product: ", error.message);
        res.status(500).json({ success: false, message: "Server Error." });
    }
};

export const createProduct = async (req, res) => {
    const product = req.body;

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
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

    req.body.images = imagesLinks

    if (!product.title || !product.description || !product.category || !product.price) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
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
        res.status(201).json({ success: true, data: populatedProduct, message: "Product created Successfully!" });
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        res.status(500).json({ success: false, message: "Server Error: Error in Creating Product." });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    let images = []
    if (Array.isArray(req.body.images)) {
        if (typeof req.body.images[0] === 'string') {
            images = req.body.images;
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
            req.body.images = imagesLinks
        } else if (typeof req.body.images[0] === 'object') {

        }
    } else if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    }

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Error in Updating Product." })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send({ message: 'Product not Found.' });
        }

        res.status(200).json({ success: true, message: "Product Deleted." })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: Error in Deleting Product." })
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

export const deleteStock = async (req, res) => {
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
    } catch (error) {
        res.status(500).json({ message: "Error in deleting stock", error })
    }
}

export const checkUserOrders = async (req, res) => {
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
                if (item.productId == productId) {
                    userHasProduct = true
                }
            })
        })

        if (!userHasProduct) {
            return res.status(200).json({ success: false, message: "User has not purchased this product.", userHasProduct })
        }

        return res.status(200).json({ success: true, message: "User has purchased this product.", userHasProduct })
    } catch (error) {
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
export const addReview = async (req, res) => {
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
                if (item.productId == productId) {
                    userHasProduct = true
                }
            })
        })

        if (!userHasProduct) {
            return res.status(404).json({ message: "User has not purchased this product.", userHasProduct })
        }

        product.reviews.map((review) => {
            if (review.userId == userId) {
                return res.status(404).json({ message: "User has already reviewed this product." })
            }
        })

        product.reviews.push(reviewData);
        await product.save();

        return res.status(200).json({ message: "Successfully added Review.", product })

    } catch (error) {
        // console.log("Error adding review", e)
        res.status(500).json({ message: "Error in adding Review", error })
    }
}

export const updateReview = async (req, res) => {
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
            if (review.userId == userId) {
                review.review = newReview
                review.rating = rating
                reviewFound = true
            }
        })

        if (reviewFound) {
            await product.save()
            return res.status(200).json({ message: "Successfully updated Review.", product })
        } else {
            return res.status(404).json({ message: "No Review Found." })
        }

    } catch (error) {
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

// export const productSeeder = async(req, res) => {
//     try {
//         for(let i = 0; i < 10; i++) {
//             const product = new Product({
//                 title: `Product ${i}`,
//                 description: `Description for Product ${i}`,
//                 price: 1000,
//                 category: "60b9b1c0f1b4c7c0a4a9f4c2",
//                 images: [
//                     {
//                         public_id: "public_id",
//                         url: "url"
//                     }
//                 ],
//                 stock: [
//                     {
//                         color: "Red",
//                         size: "M",
//                         quantity: 10
//                     },
//                     {
//                         color: "Blue",
//                         size: "L",
//                         quantity: 10
//                     }
//                 ]
//             })

//             await product.save()
//         }
//     } catch(e) {
//         console.log("Error in seeding products", e)
//     }
// }

const titles = [
    "Casual T-Shirt", 
    "Formal Shirt", 
    "Denim Jacket", 
    "Sports Shorts", 
    "Summer Dress", 
    "Winter Coat", 
    "Woolen Scarf", 
    "Running Shoes", 
    "Leather Belt", 
    "Baseball Cap"
];

const descriptions = [
    "Comfortable and stylish casual wear.",
    "Perfect for office or formal events.",
    "Rugged and durable for all seasons.",
    "Lightweight and breathable sportswear.",
    "Elegant and airy for sunny days.",
    "Cozy and warm for chilly winters.",
    "Soft and trendy winter accessory.",
    "Built for performance and durability.",
    "Classic accessory for everyday wear.",
    "Protects from the sun with a sporty look."
];

// Possible stock attributes
const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
const sizes = ["S", "M", "L", "XL", "XXL"];

// Function to generate random items from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate random stock
const generateRandomStock = () => {
    const stockCount = Math.floor(Math.random() * 5) + 1; // Random number of stock entries
    const stock = [];
    for (let i = 0; i < stockCount; i++) {
        stock.push({
            color: getRandomElement(colors),
            size: getRandomElement(sizes),
            quantity: Math.floor(Math.random() * 20) + 1 // Random quantity between 1 and 20
        });
    }
    return stock;
};

// Main function to create products
export const productSeeder = async () => {
    try {
        // Fetch available categories from MongoDB
        const categories = await Category.find({});
        if (categories.length === 0) {
            console.log("No categories available in the database.");
            return;
        }

        for (let i = 0; i < titles.length; i++) {
            const product = new Product({
                title: titles[i],
                description: descriptions[i],
                price: Math.floor(Math.random() * 5000) + 500, // Random price between 500 and 5000
                category: getRandomElement(categories)._id, // Random category
                images: [], // No images
                stock: generateRandomStock() // Randomized stock
            });

            await product.save();
            console.log(`Product ${titles[i]} created successfully!`);
        }
    } catch (error) {
        console.error("Error creating products:", error);
    }
};