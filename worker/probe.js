console.log("--- PROBE SCRIPT ATTEMPTING TO START ---");

const axios = require('axios');
require('dotenv').config();

// CONFIGURATION
const REGION = "MacBook-Local-Node"; 
const TARGET_URL = "https://www.google.com"; // The site we are monitoring
const CENTRAL_API = "http://localhost:5050/api/report"; // Your Brain's address

console.log(`🚀 Probe started for region: ${REGION}`);

process.on('uncaughtException', (err) => {
    console.error('FATAL ERROR:', err.message);
    process.exit(1);
});

async function sendPing() {
    const start = Date.now();
    try {
        // 1. Perform the "Health Check"
        await axios.get(TARGET_URL);
        const latency = Date.now() - start;

        // 2. Prepare the data
        const data = {
            region: REGION,
            url: TARGET_URL,
            status: "UP",
            latency: latency
        };

        // 3. Report the data to the Central Brain
        await axios.post(CENTRAL_API, data);
        console.log(`✅ [${REGION}] Ping Success: ${latency}ms`);
    } catch (error) {
        console.log(`❌ [${REGION}] Ping Failed`);
        // Report a "DOWN" status if the site is unreachable
        await axios.post(CENTRAL_API, {
            region: REGION,
            url: TARGET_URL,
            status: "DOWN",
            latency: 0
        });
    }
}

// Run the ping immediately, then every 30 seconds
sendPing();
setInterval(sendPing, 30000);