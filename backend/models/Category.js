import mongoose, { Schema } from 'mongoose';

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    description: {
        type: String,
        required: true,
        },
    clothing_type: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Type',
            required: true
        }
        ],  
    },
    {
        timestamps: true,
    });

    const Category = mongoose.model('Category', categorySchema);
    export default Category;