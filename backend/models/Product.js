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
    images: [
        {
            public_id: {
                type: String,
                required:true
            },
            url: {
                type:String,
                required: true
            }
        }
    ]  
    },
    {
        timestamps: true,
    });

    const Product = mongoose.model('Product', productSchema);
    export default Product;