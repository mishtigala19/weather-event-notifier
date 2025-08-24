import mongoose from 'mongoose';

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('Missing MONGODB_URI');
        process.exit(1);
    }
    try {
    const conn = await mongoose.connect(uri, {
        // Optional niceties:
        // serverSelectionTimeoutMS: 10000,
        // dbName: process.env.MONGODB_DB_NAME, // only if your URI doesn’t include the db
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
    }
}