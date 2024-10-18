import mongoose from 'mongoose';

const typeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        },
    description: {
        type: String,
        required: true,
        },
    },
    {
        timestamps: true,
    });

    const Type = mongoose.model('Type', typeSchema);
    export default Type;