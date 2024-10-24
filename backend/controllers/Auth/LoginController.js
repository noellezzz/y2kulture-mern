import User from '../../models/User.js';
import mongoose from 'mongoose';
import session from 'express-session'

export const checkUser = async (request, response) => {
    if(request.session.user) {
        response.send({loggedIn: true, user: request.session.user})
    } else {
        response.send({ loggedIn: false })
    }
}

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        // console.log(email, password)
        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            return response.status(404).json({ success: false, message: "User not found" });
        }

        request.session.user = user;
        console.log(request.session.user)
        response.status(200).json({ success: true, user });
    } catch (e) {
        console.log("Error in fetching Users: ", e.message);
        response.status(500).json({ success: false, message: "Server Error."});
    }
     
}