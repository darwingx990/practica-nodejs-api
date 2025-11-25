const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewURLParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB. All is good to Go!");
    } catch (error) {
        console.error("❌ Error trying to connect to MongoDB; ", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;


