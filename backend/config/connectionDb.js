 
const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        throw error; // Ensure server stops if DB fails
    }
};

module.exports = connectDb;
