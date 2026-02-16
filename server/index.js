const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Important: Ensure this path correctly points to your models folder
const PingLog = require('./models/PingLog'); 

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // Don't kill the server, but log the error
    }
};

connectDB();

// Test Route
app.get('/', (req, res) => {
    res.send('Edge-Alert Central API is Running!');
});

// Endpoint for Probes to report data
app.post('/api/report', async (req, res) => {
    try {
        console.log("Incoming Data:", req.body); // Useful for debugging what the probe sends
        
        const { region, url, status, latency } = req.body;
        
        // Creating the new document using the model constructor
        const newLog = new PingLog({ 
            region, 
            url, 
            status, 
            latency: Number(latency) // Ensuring latency is a number
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

// Endpoint for React Frontend to get history
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await PingLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is purring on http://localhost:${PORT}`);
});