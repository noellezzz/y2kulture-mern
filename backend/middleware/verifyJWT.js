import jwt from 'jsonwebtoken'

export const verifyJWT = (request, response, next) => {
    const authHeader =  request.headers.authorization || request.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split('')[1]
    jwt.verifu(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return response.status(403).json({ message: 'Forbidden' })
                request.email = decoded.UserInfo.email;
                request.role = decoded.UserInfo.role;
                request.status = decoded.UserInfo.status;
                next();
        }
    )
}