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
import { corsOptions } from './config/corsOptions.js'
import cloudinary from 'cloudinary'
import Multer from 'multer'
import User from './models/User.js'

import { connectDB } from './config/db.js'

const app = express()

app.use(express.json({limit:'50mb'}));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


dotenv.config()

const port = process.env.PORT
const mongodb_uri = process.env.MONGODB_URI

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODUINARY_API_SECRET,
});

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

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

app.get('/sales-data', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        // console.log(starDate, endDate)
        // Validate date range
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and end dates are required." });
        }

        // Convert query parameters to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Aggregate sales data from the User model
        const salesData = await User.aggregate([
            { $unwind: "$checkout" }, // Unwind the checkout array
            { $unwind: "$checkout.order.items" }, // Unwind the order items array
            {
                $match: {
                    "checkout.order.datePlaced": { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkout.order.datePlaced" },
                        month: { $month: "$checkout.order.datePlaced" },
                        day: { $dayOfMonth: "$checkout.order.datePlaced" }
                    },
                    totalSales: { $sum: "$checkout.order.total_cost" }, // Sum total_cost
                    totalItemsSold: { $sum: "$checkout.order.items.quantity" } // Sum total items
                }
            },
            {
                $sort: { "_id": 1 } // Sort by year, month, and day
            }
        ]);

        res.status(200).json({
            success: true,
            data: salesData,
            message: "Sales data retrieved successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving sales data.",
            error: error.message
        });
    }
});
