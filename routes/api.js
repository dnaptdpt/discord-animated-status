const express = require('express');
const router = express.Router();
const Animation = require('../models/Animation');
const statusRotator = require('../utils/statusRotator');

// ==================== ANIMATIONS CRUD ====================

// Get all animations
router.get('/animations', async (req, res) => {
    try {
        const animations = await Animation.find().sort({ updatedAt: -1 });
        res.json(animations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single animation
router.get('/animations/:id', async (req, res) => {
    try {
        const animation = await Animation.findById(req.params.id);
        if (!animation) {
            return res.status(404).json({ error: 'Animation not found' });
        }
        res.json(animation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create animation
router.post('/animations', async (req, res) => {
    try {
        const animation = new Animation(req.body);
        await animation.save();
        res.json(animation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update animation
router.put('/animations/:id', async (req, res) => {
    try {
        const animation = await Animation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!animation) {
            return res.status(404).json({ error: 'Animation not found' });
        }
        res.json(animation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete animation
router.delete('/animations/:id', async (req, res) => {
    try {
        const animation = await Animation.findByIdAndDelete(req.params.id);
        if (!animation) {
            return res.status(404).json({ error: 'Animation not found' });
        }
        
        // If deleting active animation, stop rotation
        if (animation.isActive && global.config.isRunning) {
            statusRotator.stop();
        }
        
        res.json({ success: true, message: 'Animation deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ANIMATION CONTROL ====================

// Start animation
router.post('/start/:id', async (req, res) => {
    try {
        const result = await statusRotator.start(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stop animation
router.post('/stop', async (req, res) => {
    try {
        const result = statusRotator.stop();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STATUS & INFO ====================

// Get current status
router.get('/status', (req, res) => {
    try {
        const status = statusRotator.getStatus();
        
        // Add user info
        status.user = global.client.user ? {
            tag: global.client.user.tag,
            id: global.client.user.id,
            username: global.client.user.username,
            discriminator: global.client.user.discriminator
        } : null;
        
        // Add emoji count
        status.emojis = global.client.emojis.cache.size;
        
        // Add server count
        status.guilds = global.client.guilds.cache.size;
        
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available emojis
router.get('/emojis', (req, res) => {
    try {
        const emojis = global.client.emojis.cache.map(e => ({
            id: e.id,
            name: e.name,
            animated: e.animated,
            url: e.url,
            guild: e.guild ? {
                id: e.guild.id,
                name: e.guild.name
            } : null
        }));
        
        // Sort by name
        emojis.sort((a, b) => a.name.localeCompare(b.name));
        
        res.json(emojis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== LOG MODE CONTROL ====================

// Get current log mode
router.get('/log-mode', (req, res) => {
    try {
        res.json({
            currentMode: statusRotator.logMode,
            availableModes: ['none', 'minimal', 'detailed'],
            description: {
                none: 'No frame logs, only start/stop',
                minimal: 'Single line update (recommended)',
                detailed: 'Full details for each frame'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change log mode
router.post('/log-mode', (req, res) => {
    try {
        const { mode } = req.body;
        const validModes = ['none', 'minimal', 'detailed'];
        
        if (!validModes.includes(mode)) {
            return res.status(400).json({ 
                error: 'Invalid mode',
                validModes: validModes
            });
        }
        
        statusRotator.setLogMode(mode);
        
        res.json({
            success: true,
            message: `Log mode changed to: ${mode}`,
            currentMode: mode
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TEST & DEBUG ENDPOINTS ====================

// Test current Discord presence (for debugging)
router.get('/test-presence', async (req, res) => {
    try {
        const user = global.client.user;
        if (!user) {
            return res.status(503).json({ error: 'Discord client not ready' });
        }
        
        const presence = user.presence;
        const activities = presence?.activities || [];
        
        res.json({
            user: {
                tag: user.tag,
                id: user.id,
                username: user.username
            },
            presence: {
                status: presence?.status || 'unknown',
                clientStatus: presence?.clientStatus,
                activities: activities.map(a => ({
                    type: a.type,
                    name: a.name,
                    state: a.state,
                    details: a.details,
                    emoji: a.emoji ? {
                        name: a.emoji.name,
                        id: a.emoji.id,
                        animated: a.emoji.animated
                    } : null,
                    createdTimestamp: a.createdTimestamp
                }))
            },
            rotation: {
                isRunning: global.config.isRunning,
                interval: global.config.interval,
                currentAnimation: global.currentAnimation ? {
                    id: global.currentAnimation._id,
                    name: global.currentAnimation.name,
                    totalFrames: global.currentAnimation.frames.length,
                    currentFrame: statusRotator.currentFrameIndex
                } : null
            },
            stats: {
                emojis: global.client.emojis.cache.size,
                guilds: global.client.guilds.cache.size,
                uptime: process.uptime(),
                memory: process.memoryUsage()
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Discord raw presence (force fetch from API)
router.get('/discord-presence', async (req, res) => {
    try {
        const user = global.client.user;
        if (!user) {
            return res.status(503).json({ error: 'Discord client not ready' });
        }
        
        // Force fetch from Discord API
        const raw = await user.fetch(true);
        
        res.json({
            username: raw.username,
            discriminator: raw.discriminator,
            tag: raw.tag,
            id: raw.id,
            presence: {
                status: raw.presence?.status,
                activities: raw.presence?.activities || []
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        discord: global.client.user ? 'connected' : 'disconnected',
        rotation: global.config.isRunning ? 'running' : 'stopped',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Get server/guild list
router.get('/guilds', (req, res) => {
    try {
        const guilds = global.client.guilds.cache.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.iconURL(),
            memberCount: g.memberCount,
            emojiCount: g.emojis.cache.size
        }));
        
        res.json(guilds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== EXPORT/IMPORT ====================

// Export animation to JSON
router.get('/export/:id', async (req, res) => {
    try {
        const animation = await Animation.findById(req.params.id);
        if (!animation) {
            return res.status(404).json({ error: 'Animation not found' });
        }
        
        const exportData = {
            name: animation.name,
            frames: animation.frames,
            interval: animation.interval,
            exportedAt: new Date().toISOString(),
            version: '2.0.0'
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${animation.name}.json"`);
        res.json(exportData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import animation from JSON
router.post('/import', async (req, res) => {
    try {
        const { name, frames, interval } = req.body;
        
        if (!name || !frames || !Array.isArray(frames)) {
            return res.status(400).json({ error: 'Invalid import data' });
        }
        
        // Check if name exists
        let finalName = name;
        let counter = 1;
        while (await Animation.findOne({ name: finalName })) {
            finalName = `${name} (${counter})`;
            counter++;
        }
        
        const animation = new Animation({
            name: finalName,
            frames: frames,
            interval: interval || 10000
        });
        
        await animation.save();
        
        res.json({
            success: true,
            message: 'Animation imported successfully',
            animation: animation
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STATS ====================

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const totalAnimations = await Animation.countDocuments();
        const activeAnimation = await Animation.findOne({ isActive: true });
        
        let totalFrames = 0;
        const animations = await Animation.find();
        animations.forEach(anim => {
            totalFrames += anim.frames.length;
        });
        
        res.json({
            animations: {
                total: totalAnimations,
                totalFrames: totalFrames,
                active: activeAnimation ? activeAnimation.name : null
            },
            discord: {
                user: global.client.user ? global.client.user.tag : null,
                guilds: global.client.guilds.cache.size,
                emojis: global.client.emojis.cache.size
            },
            rotation: {
                isRunning: global.config.isRunning,
                interval: global.config.interval,
                currentFrame: statusRotator.currentFrameIndex,
                logMode: statusRotator.logMode
            },
            system: {
                uptime: process.uptime(),
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
                },
                platform: process.platform,
                nodeVersion: process.version
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== QUICK ACTIONS ====================

// Duplicate animation
router.post('/duplicate/:id', async (req, res) => {
    try {
        const original = await Animation.findById(req.params.id);
        if (!original) {
            return res.status(404).json({ error: 'Animation not found' });
        }
        
        // Find unique name
        let newName = original.name + ' (Copy)';
        let counter = 1;
        while (await Animation.findOne({ name: newName })) {
            newName = `${original.name} (Copy ${counter})`;
            counter++;
        }
        
        const duplicate = new Animation({
            name: newName,
            frames: original.frames,
            interval: original.interval
        });
        
        await duplicate.save();
        
        res.json({
            success: true,
            message: 'Animation duplicated',
            animation: duplicate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear all animations
router.delete('/clear-all', async (req, res) => {
    try {
        // Stop rotation first
        if (global.config.isRunning) {
            statusRotator.stop();
        }
        
        const result = await Animation.deleteMany({});
        
        res.json({
            success: true,
            message: `Deleted ${result.deletedCount} animation(s)`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
