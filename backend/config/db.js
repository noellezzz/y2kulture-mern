import mongoose from 'mongoose';

export const connectDB = async (mongoURL) => {
    try {
        const conn = await mongoose.connect(mongoURL);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to database. Error: ${error.message}`)
    }
}