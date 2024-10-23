import mongoose from 'mongoose'

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
        required: true
    },
    status: {
        type:String,
        required: true
    }
    }, {
        timestamps: true,
});

const User = mongoose.model('User', UserSchema);
export default User;