import Product from "../models/Product.js"
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'

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
        .exec();
        response.status(200).json({ success: true, message: "Product Retrieved.", data: product });
    } catch (error) {
        console.log("Error in fetching products: ", error.message);
        response.status(500).json({ success: false, message: "Server Error."});
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
        response.status(500).json({ success: false, message: "Server Error."});
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
    // console.log(request.body)
	for (let i = 0; i < images.length; i++) {
		try {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'products',
				width: 150,
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
    console.log(imagesLinks)
    
    if(!product.title || !product.description || !product.category) {
        return response.status(400).json({ success:false, message:"Please provide all fields."});
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
        response.status(201).json({ success:true, data: populatedProduct, message: "Product created Successfully!"});
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        response.status(500).json({ success: false, message: "Server Error: Error in Creating Product."});
    }
}

export const updateProduct = async (request, response) => {
    const { id } = request.params;

    const product = request.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ success:false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        response.status(200).json({ success:true, data:updatedProduct });
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Updating Product."})
    }
}

export const deleteProduct = async (request, response) => {
    const { id } = request.params;
    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).send({ message: 'Product not Found.'});
        }

        response.status(200).json({ success: true, message: "Product Deleted." })
    } catch (error) {
        response.status(500).json({ success: false, message: "Server Error: Error in Deleting Product." })
    }
}