const mongoose = require('mongoose');

const resumeDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'anonymous' // Will update this when we add user auth later
    },
    parsedText: {
        type: String,
        default: ''
    },
    atsScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h' // Auto delete document after 24 hours
    }
});

module.exports = mongoose.model('ResumeData', resumeDataSchema);