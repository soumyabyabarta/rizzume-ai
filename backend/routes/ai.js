const express = require('express');
const router = express.Router();
const { getResumeFeedback, generateCareerRoadmap } = require('../services/geminiService');
const ResumeData = require('../models/ResumeData');

// ---------------------------------------------------------
// ROUTE 1: AI Feedback & Roast Mode (Chapter 4)
// POST /api/ai/feedback
// ---------------------------------------------------------
router.post('/feedback', async (req, res) => {
    try {
        const { documentId, jobDescription, mode } = req.body;

        if (!documentId) {
            return res.status(400).json({ success: false, error: "Document ID is required." });
        }

        // Fetch the parsed resume text from our database
        const resumeRecord = await ResumeData.findById(documentId);
        
        if (!resumeRecord) {
            return res.status(404).json({ success: false, error: "Resume not found. Maybe it auto-deleted?" });
        }

        const targetJob = jobDescription || "Software Engineer";
        const feedbackMode = mode === 'roast' ? 'roast' : 'professional';

        // Call our Gemini AI Service
        const aiResponse = await getResumeFeedback(resumeRecord.parsedText, targetJob, feedbackMode);

        if (aiResponse.error) {
            return res.status(500).json({ success: false, error: aiResponse.error });
        }

        res.status(200).json({
            success: true,
            mode: feedbackMode,
            data: aiResponse
        });

    } catch (error) {
        console.error("Feedback Route Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// ---------------------------------------------------------
// ROUTE 2: AI Career Roadmap Generator (Chapter 5)
// POST /api/ai/roadmap
// ---------------------------------------------------------
router.post('/roadmap', async (req, res) => {
    try {
        const { targetJob, missingSkills } = req.body;

        if (!targetJob) {
            return res.status(400).json({ success: false, error: "Target Job is required to generate a roadmap." });
        }

        // Call Gemini to generate the sprint roadmap
        const roadmapData = await generateCareerRoadmap(targetJob, missingSkills || []);

        if (roadmapData.error) {
            return res.status(500).json({ success: false, error: roadmapData.error });
        }

        res.status(200).json({
            success: true,
            message: "Roadmap generated successfully! 🗺️",
            data: roadmapData
        });

    } catch (error) {
        console.error("Roadmap Route Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;