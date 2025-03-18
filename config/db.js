const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is missing in .env file!");
        process.exit(1);
    }

    if (isConnected) {
        console.log("⚡ Using existing MongoDB connection");
        return;
    }

    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
