const Animation = require('../models/Animation');

class StatusRotator {
    constructor() {
        this.currentFrameIndex = 0;
        this.intervalId = null;
        this.logMode = 'minimal'; // 'none', 'minimal', 'detailed'
    }

    async start(animationId) {
        if (this.intervalId) {
            this.stop();
        }

        const animation = await Animation.findById(animationId);
        if (!animation || animation.frames.length === 0) {
            throw new Error('Animation not found or empty');
        }

        global.currentAnimation = animation;
        global.config.isRunning = true;
        this.currentFrameIndex = 0;

        // Log start
        if (this.logMode !== 'none') {
            console.log(`\n✅ Started animation: "${animation.name}" (${animation.frames.length} frames, ${animation.interval}ms interval)\n`);
        }

        // Set first frame immediately
        await this.rotateFrame();

        // Start interval
        this.intervalId = setInterval(async () => {
            await this.rotateFrame();
        }, animation.interval);

        // Set active animation
        await Animation.updateMany({}, { isActive: false });
        animation.isActive = true;
        await animation.save();

        return { success: true, message: `Started animation: ${animation.name}` };
    }

    async rotateFrame() {
        try {
            const animation = global.currentAnimation;
            if (!animation || animation.frames.length === 0) {
                this.stop();
                return;
            }

            const frame = animation.frames[this.currentFrameIndex];
            let statusText = frame.text;
            let emoji = frame.emoji;

            // Evaluate code if isEval
            if (frame.isEval && frame.evalCode) {
                try {
                    statusText = eval(frame.evalCode);
                } catch (err) {
                    console.error('Eval error:', err);
                    statusText = frame.text;
                }
            }

            // Set Discord status
            await this.setCustomStatus(statusText, emoji, frame.emojiId);

            // Log based on mode
            if (this.logMode === 'detailed') {
                // Detailed log
                console.log('═══════════════════════════════════════');
                console.log(`🔄 Frame: [${this.currentFrameIndex + 1}/${animation.frames.length}]`);
                console.log(`📝 "${statusText.substring(0, 80)}${statusText.length > 80 ? '...' : ''}"`);
                if (emoji) console.log(`🎨 Emoji: ${emoji}`);
                console.log(`⏱️  Next: ${animation.interval}ms`);
                console.log('═══════════════════════════════════════\n');
            } else if (this.logMode === 'minimal') {
                // Minimal log - Single line, update in place
                const frameNum = `[${this.currentFrameIndex + 1}/${animation.frames.length}]`;
                const preview = statusText.substring(0, 50);
                const emoji_display = emoji ? ` ${emoji}` : '';
                
                // Clear previous line and write new one
                process.stdout.write(`\r🔄 ${frameNum} ${preview}${statusText.length > 50 ? '...' : ''}${emoji_display}`.padEnd(100));
            }
            // 'none' mode: không log gì cả

            // Move to next frame
            this.currentFrameIndex = (this.currentFrameIndex + 1) % animation.frames.length;

        } catch (error) {
            console.error('\n❌ Rotation error:', error);
        }
    }

    async setCustomStatus(text, emoji = null, emojiId = null) {
        try {
            let emojiData = null;

            if (emoji || emojiId) {
                // Custom emoji với ID
                if (emojiId) {
                    const foundEmoji = global.client.emojis.cache.get(emojiId);
                    if (foundEmoji) {
                        emojiData = {
                            name: foundEmoji.name,
                            id: foundEmoji.id,
                            animated: foundEmoji.animated
                        };
                    }
                }
                // Parse từ format <:name:id>
                else if (emoji && emoji.match(/<(a)?:(\w+):(\d+)>/)) {
                    const match = emoji.match(/<(a)?:(\w+):(\d+)>/);
                    emojiData = {
                        name: match[2],
                        id: match[3],
                        animated: !!match[1]
                    };
                }
                // Unicode emoji
                else if (emoji) {
                    emojiData = { name: emoji };
                }
            }

            const presence = {
                status: 'online',
                activities: [{
                    type: 4,
                    state: text,
                    name: 'Custom Status'
                }]
            };

            if (emojiData) {
                presence.activities[0].emoji = emojiData;
            }

            await global.client.user.setPresence(presence);
            return true;

        } catch (error) {
            console.error('Set status error:', error);
            return false;
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        global.config.isRunning = false;
        this.currentFrameIndex = 0;
        
        if (this.logMode !== 'none') {
            console.log('\n\n⏹️  Animation stopped\n');
        }
        
        return { success: true, message: 'Animation stopped' };
    }

    getStatus() {
        return {
            isRunning: global.config.isRunning,
            currentAnimation: global.currentAnimation ? {
                id: global.currentAnimation._id,
                name: global.currentAnimation.name,
                frames: global.currentAnimation.frames.length,
                interval: global.currentAnimation.interval,
                currentFrame: this.currentFrameIndex
            } : null
        };
    }

    // Set log mode
    setLogMode(mode) {
        const validModes = ['none', 'minimal', 'detailed'];
        if (validModes.includes(mode)) {
            this.logMode = mode;
            console.log(`\n📝 Log mode set to: ${mode}\n`);
        } else {
            console.error(`Invalid log mode. Use: ${validModes.join(', ')}`);
        }
    }
}

module.exports = new StatusRotator();
