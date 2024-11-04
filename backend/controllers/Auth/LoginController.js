import User from '../../models/User.js';
import mongoose from 'mongoose';
import session from 'express-session'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { sendToken } from '../../utils/jwtToken.js'

import admin from "firebase-admin";
import serviceAccount from "../../firebase/serviceAccountKey.json" assert { type: "json" };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// export const isAuthenticatedUser = async (req, res, next) => {
//     const { token } = req.cookies.jwt
//     console.log(token)
//     if (!token) {
//         return res.status(401).json({message:'Login first to access this resource'})
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//     req.user = await User.findById(decoded.id);
    
//     next()
// };


export const checkUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        return res.status(200).json({
            success: true,
            user
        })
    } catch(e) {
        return res.status(500).json({
            success: false,
            message: "Server Error."
        })
    }
}

export const loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await bcrypt.hash("secret", 10);
            const [firstName, lastName] = decodedToken.name.split(" ");
            const photoURL = decodedToken.picture || "default_avatar_url"; // using `picture` as the photo URL field
        
            user = await User.create({
                email: decodedToken.email,
                name: decodedToken.name,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                avatar: [{ public_id: "123", url: photoURL }],
            });
        
            return sendToken(user, 200, res);
        }

        sendToken(user, 200, res);
    } catch (e) {
        console.log("Error in Google login: ", e.message);
        res.status(500).json({ success: false, message: "Server Error." });
    }
};

export const login = async (req, res) => {
    // try {
    //     const { email, password } = req.body;
    //     const user = await User.findOne({ email: email, password: password });

    //     if (!user) {
    //         return res.status(404).json({ success: false, message: "User not found" });
    //     }

    //     sendToken(user, 200, res)
    // } catch (e) {
    //     console.log("Error in fetching Users: ", e.message);
    //     res.status(500).json({ success: false, message: "Server Error."});
    // }
    try {
        const { token } = req.body; // Firebase ID token sent from the client

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email } = decodedToken;

        // Check if the user exists in MongoDB
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send a session token or proceed with additional login logic
        sendToken(user, 200, res);
    } catch (e) {
        console.log("Error in fetching Users: ", e.message);
        res.status(500).json({ success: false, message: "Server Error." });
    }
}

export const logout = (request, response) => {
    const cookies = request.cookies
    if (!cookies?.token) return response.sendStatus(204)
        response.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true})
    response.json({ message: "Cookie Cleared." })
}