import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import categoryRoute from './routes/CategoryRoute.js'
import typeRoute from './routes/TypeRoute.js'
import productRoute from './routes/ProductRoute.js'
import promoRoute from './routes/PromoRoute.js'

import { connectDB } from './config/db.js'

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const port = process.env.PORT
const mongodb_uri = process.env.MONGODB_URI

app.use('/api/category', categoryRoute);
app.use('/api/type', typeRoute);
app.use('/api/product', productRoute);
app.use('/api/promo', promoRoute);

app.listen(port, () => {
    console.log("Server is running. Connected to port: ", port)
    console.log("Attempting to connect to Database...")
    connectDB(mongodb_uri)
})