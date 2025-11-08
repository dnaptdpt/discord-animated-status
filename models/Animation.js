const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        default: null
    },
    emojiId: {
        type: String,
        default: null
    },
    isEval: {
        type: Boolean,
        default: false
    },
    evalCode: {
        type: String,
        default: null
    }
});

const animationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    frames: [frameSchema],
    interval: {
        type: Number,
        default: 10000,
        min: 2900
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

animationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Animation', animationSchema);
