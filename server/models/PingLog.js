const mongoose = require('mongoose');

const PingLogSchema = new mongoose.Schema({
    region: { type: String, required: true }, // e.g., "Asia-Mumbai"
    url: { type: String, required: true },    // e.g., "google.com"
    status: { type: String, required: true }, // "UP" or "DOWN"
    latency: { type: Number, required: true }, // in milliseconds
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PingLog', PingLogSchema);