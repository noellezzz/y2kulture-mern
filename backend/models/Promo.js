import mongoose, { Schema } from 'mongoose';

const promoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    promo_for: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    discount: {
        type: Number,
        required: true,
        default: 1
    },
    voucher_code: {
        type: String,
        required: true,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
},
    {
        timestamps: true,
    });

const Promo = mongoose.model('Promo', promoSchema);
export default Promo;