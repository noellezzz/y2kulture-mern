import mongoose, { Schema } from 'mongoose';

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    description: {
        type: String,
        required: true,
        },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
        ],  
    },
    {
        timestamps: true,
    });

    const Product = mongoose.model('Product', productSchema);
    export default Product;