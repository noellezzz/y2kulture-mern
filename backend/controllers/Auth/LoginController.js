import User from '../../models/User.js';
import mongoose from 'mongoose';
import session from 'express-session'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { sendToken } from '../../utils/jwtToken.js'

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
    // const cookies = request.cookies
    // if (!cookies?.jwt) return response.status(401).json({ message: 'Unauthorized' })
    // const refreshToken = cookies.jwt
    // jwt.verify(
    //     refreshToken,
    //     process.env.REFRESH_TOKEN_SECRET,
    //     asyncHandler(async (err, decoded) => {
    //         if (err) return response.status(403).json({ message: "Forbidden" })
    //         const user = await User.findOne({ email: decoded.email })
    //         if (!user) return response.status(401).json({ message: 'Unatuhorized.' })
    //         const accessToken = jwt.sign({
    //             "UserInfo": {
    //                 "email": user.email,
    //                 "role": user.role,
    //                 "status": user.status
    //             }
    //             },
    //             process.env.ACCESS_TOKEN_SECRET,
    //             { expiresIn: '1d' }
    //         )

    //         response.json({ accessToken })
    //     })
    // )

    const user = await User.findById(req.user.id);

    return res.status(200).json({
        success: true,
        user
    })
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // const accessToken = jwt.sign({
        //     "UserInfo": {
        //         "email": user.email,
        //         "role": user.role,
        //         "status": user.status
        //     }},
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // )

        // const refreshToken = jwt.sign(
        //     { "email": user.email },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // )

        // response.cookie('jwt', refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None',
        //     maxAge: 8 * 24 * 60 * 60 * 1000
        // })

        sendToken(user, 200, res)
        // response.status(200).json({ success: true, user, accessToken });
    } catch (e) {
        console.log("Error in fetching Users: ", e.message);
        res.status(500).json({ success: false, message: "Server Error."});
    }
     
}

export const logout = (request, response) => {
    const cookies = request.cookies
    if (!cookies?.token) return response.sendStatus(204)
        response.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true})
    response.json({ message: "Cookie Cleared." })
}