import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import categoryRoute from './routes/CategoryRoute.js'
import typeRoute from './routes/TypeRoute.js'
import productRoute from './routes/ProductRoute.js'
import promoRoute from './routes/PromoRoute.js'
import userRoute from './routes/userRoute.js'
import loginRoute from './routes/Auth/LoginRoute.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import { connectDB } from './config/db.js'

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    key: "userId",
    secret: "something",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}))

dotenv.config()

const port = process.env.PORT
const mongodb_uri = process.env.MONGODB_URI

app.use('/api/category', categoryRoute);
app.use('/api/type', typeRoute);
app.use('/api/product', productRoute);
app.use('/api/promo', promoRoute);
app.use('/api/user', userRoute);

app.use('/auth', loginRoute)

app.listen(port, () => {
    console.log("Server is running. Connected to port: ", port)
    console.log("Attempting to connect to Database...")
    connectDB(mongodb_uri)
})