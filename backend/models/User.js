import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    first_name: {
        type: String,
        required: false,
        default: ''
    },
    last_name: {
        type: String,
        required: false,
        default: ''
    },
    address: [
        {
            street_address: {
                type: String,
                required: false,
                default: ''
            },
            city: {
                type: String,
                required: false,
                default: ''
            },
            state: {
                type: String,
                required: false,
                default: ''
            },
            country: {
                type: String,
                required: false,
                default: ''
            },
            zip_code: {
                type: String,
                required: false,
                default: ''
            },
        },
    ],
    birthday: {
        type: String,
        required: false,
        default: ''
    },
    gender: {
        type: String,
        required: false,
        default: ''
    },
    contact_number: {
        type: String,
        required: false,
        default: ''
    },
    avatar: [
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
    ],
    cart: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            stockId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    checkout: [
        {
            order: {
                items: [
                    {
                        productId: {
                            type: Schema.Types.ObjectId,
                            ref: 'Product',
                            required: true
                        },
                        stockId: {
                            type: Schema.Types.ObjectId,
                            required: true
                        },
                        color: {
                            type: String,
                            required: true
                        },
                        size: {
                            type: String,
                            required: true
                        },
                        quantity: {
                            type: Number,
                            required: true,
                            default: 1
                        }
                    }
                ],
                status: {
                    type: String,
                    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
                    default: 'Pending'
                },
                datePlaced: {
                    type: Date,
                    default: Date.now
                },
                dateShipped: {
                    type: Date,
                    required: false,
                },
                dateDelivered: {
                    type: Date,
                    required: false,
                },
                shippingDetails: {
                    type: String,
                    required: true
                },
                applied_voucher: {
                    type: Schema.Types.ObjectId,
                    ref: 'Promo',
                    required: false
                },
                total_cost: {
                    type:Number,
                    required: true
                }
            }
        }
    ]
}, {
    timestamps: true,
});

UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

const User = mongoose.model('User', UserSchema);
export default User;