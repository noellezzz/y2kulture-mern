import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required:true
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
        type:String,
        required: true,
        default: 'active'
    }
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