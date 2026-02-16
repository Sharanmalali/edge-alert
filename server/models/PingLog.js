const mongoose = require('mongoose');

console.log("--- PINGLOG.JS IS BEING LOADED ---");

const PingLogSchema = new mongoose.Schema({
    region: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, required: true },
    latency: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

try {
    const Model = mongoose.model('PingLog', PingLogSchema);
    module.exports = Model;
    console.log("--- PINGLOG MODEL EXPORTED SUCCESSFULLY ---");
} catch (error) {
    console.log("--- ERROR DURING MODEL CREATION ---", error);
}