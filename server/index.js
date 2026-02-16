const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const PingLog = require('./models/PingLog'); 

const app = express();
const PORT = process.env.PORT || 5050;

// --- UPDATED MIDDLEWARE ---
// This allows your Vercel URL to access the data. 
// Replace 'https://your-project-name.vercel.app' with your actual Vercel link!
app.use(cors({
    origin: '*', // For the project submission, '*' is easiest as it allows all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Connection logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
};

connectDB();

app.get('/', (req, res) => {
    res.send('Edge-Alert Central API is Running!');
});

app.post('/api/report', async (req, res) => {
    try {
        console.log("Incoming Data:", req.body);
        const { region, url, status, latency } = req.body;
        
        const newLog = new PingLog({ 
            region, 
            url, 
            status, 
            latency: Number(latency)
        });
        
        await newLog.save();
        res.status(201).json({ message: "Log saved successfully" });
    } catch (error) {
        console.error("SAVE ERROR:", error.message);
        res.status(500).json({ 
            error: "Failed to save log", 
            details: error.message 
        });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        const logs = await PingLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is purring on port ${PORT}`);
});