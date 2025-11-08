require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Client } = require('discord.js-selfbot-v13');
const path = require('path');
const statusRotator = require('./utils/statusRotator');

// ==================== EXPRESS APP ====================
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ==================== DISCORD CLIENT ====================
const client = new Client({ checkUpdate: false });

// ==================== GLOBAL STATE ====================
global.client = client;
global.config = {
    interval: parseInt(process.env.DEFAULT_INTERVAL) || 10000,
    minInterval: parseInt(process.env.MIN_INTERVAL) || 2900,
    isRunning: false
};
global.currentAnimation = null;
global.rotationInterval = null;

// ==================== CONFIGURE LOG MODE ====================
const LOG_MODE = process.env.LOG_MODE || 'minimal'; // 'none', 'minimal', 'detailed'
statusRotator.setLogMode(LOG_MODE);

console.log('╔═══════════════════════════════════════════════╗');
console.log('║  Discord Animated Status Selfbot             ║');
console.log('╚═══════════════════════════════════════════════╝');
console.log('');

// ==================== MONGODB CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
    })
    .catch(err => {
        console.error('❌ MongoDB Error:', err.message);
        process.exit(1);
    });

// ==================== DISCORD EVENTS ====================
client.on('ready', () => {
    console.log('═══════════════════════════════════════════════');
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📝 User ID: ${client.user.id}`);
    console.log(`🌐 Web UI: http://localhost:${process.env.PORT || 3000}`);
    console.log(`🎨 Custom Emojis: ${client.emojis.cache.size} available`);
    console.log(`🏠 Servers: ${client.guilds.cache.size}`);
    console.log(`📊 Log Mode: ${LOG_MODE}`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
});

client.on('error', (error) => {
    console.error('Discord client error:', error);
});

client.on('disconnect', () => {
    console.log('⚠️  Disconnected from Discord');
});

// ==================== LOGIN ====================
console.log('🔐 Logging in to Discord...');
client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error('❌ Login failed:', err.message);
    console.error('');
    console.error('Please check:');
    console.error('1. Your Discord token is correct in .env file');
    console.error('2. Token is not expired');
    console.error('3. Account is not locked');
    console.error('');
    process.exit(1);
});

// ==================== API ROUTES ====================
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// ==================== WEB UI ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        message: 'The requested resource does not exist'
    });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
    console.error('Express error:', err.stack);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, try to recover
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('');
});

// ==================== GRACEFUL SHUTDOWN ====================
const gracefulShutdown = async (signal) => {
    console.log('');
    console.log(`\n⏹️  Received ${signal}. Shutting down gracefully...`);
    
    // Stop rotation
    if (global.config.isRunning) {
        console.log('⏹️  Stopping animation rotation...');
        statusRotator.stop();
    }
    
    // Close server
    server.close(() => {
        console.log('✅ HTTP server closed');
    });
    
    // Close MongoDB
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (err) {
        console.error('Error closing MongoDB:', err);
    }
    
    // Destroy Discord client
    try {
        client.destroy();
        console.log('✅ Discord client destroyed');
    } catch (err) {
        console.error('Error destroying Discord client:', err);
    }
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║  Shutdown complete. Goodbye! 👋               ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log('');
    
    process.exit(0);
};

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Windows specific
if (process.platform === 'win32') {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// ==================== EXPORTS ====================
module.exports = { app, client, server };
