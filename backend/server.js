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

app.post("/upload", upload.single("my_file"), async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        res.json(cldRes);
    } catch (error) {
        console.log(error);
        res.send({
        message: error.message,
        });
    }
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